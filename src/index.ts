import { execSync, type ExecException } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { resolveOptions } from './options'
import { cloneRepo } from './utils/clone-repo'
import type { Options } from './options/types'

// Exports
export { defineConfig } from './config/define-config'
export type { Options, ResolvedOptions } from './options/types'

/**
 * Run ecosystem-ci with the given options
 * @param options Options to run ecosystem-ci with
 */
export async function ecosystemCi(options: Options): Promise<void> {
  // Resolve options
  const resolvedOptions = resolveOptions(options)

  // Ensure temp directory exists (node_modules/.ecosystem-ci)
  const tempDir = path.join(process.cwd(), '.ecosystem-ci')
  fs.mkdirSync(tempDir, { recursive: true })

  // If force option is enabled, remove temp directory contents
  if (resolvedOptions.force) {
    console.info(`Force option enabled. Removing contents of ${tempDir}...`)
    fs.rmSync(tempDir, { recursive: true, force: true })
    fs.mkdirSync(tempDir, { recursive: true })
  }

  // Clone each repository
  for (const pkg of resolvedOptions.ecosystem) {
    // Determine the package directory
    const pkgDir = path.join(tempDir, pkg.name)

    // Verify if the package directory exists already
    if (fs.existsSync(pkgDir)) {
      console.info(`Package ${pkg.name} already cloned. Skipping clone.`)
    }
    // Else, clone the repository
    else {
      console.info(`Cloning package ${pkg.name} into ${pkgDir}...`)
      await cloneRepo(pkg.repository, pkgDir)
    }
  }

  // Replace npm imports and add pnpm overrides
  for (const pkg of resolvedOptions.ecosystem) {
    // Determine the package directory
    const pkgDir = path.join(tempDir, pkg.name)
    const packageJsonPath = path.join(pkgDir, 'package.json')
    const packageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, 'utf8'),
    ) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
      pnpm?: { overrides?: Record<string, string> }
    }

    // Function to replace import in dependencies or devDependencies
    const replaceImport = (deps: Record<string, string> | undefined) => {
      if (!deps) return
      for (const depName of Object.keys(deps)) {
        if (depName === resolvedOptions.name) {
          deps[depName] = resolvedOptions.npmImportReplacement
          console.info(
            `Replaced npm import for package ${pkg.name} in ${packageJsonPath}.`,
          )
        }
      }
    }

    // Replace npm imports in dependencies and devDependencies
    replaceImport(packageJson.dependencies)
    replaceImport(packageJson.devDependencies)

    // Add pnpm overrides if any
    if (pkg.pnpmOverrides) {
      packageJson.pnpm = packageJson.pnpm || {}
      packageJson.pnpm.overrides = {
        ...packageJson.pnpm.overrides,
        ...pkg.pnpmOverrides,
      }
      console.info(
        `Added pnpm overrides for package ${pkg.name} in ${packageJsonPath}.`,
      )
    }

    // Write back the modified package.json
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      'utf8',
    )
  }

  // Run actions for each package
  for (const pkg of resolvedOptions.ecosystem) {
    const pkgDir = path.join(tempDir, pkg.name)
    console.info(`Running actions for package ${pkg.name}...`)
    for (const action of pkg.actions) {
      console.info(`  Executing action: ${action}`)
      try {
        execSync(action, {
          cwd: pkgDir,
          env: {
            ...process.env,
          },
          stdio: 'pipe',
        })
      } catch (error) {
        const execError = error as ExecException
        const stdout = execError.stdout
          ? execError.stdout.toString().trimEnd()
          : ''
        const stderr = execError.stderr
          ? execError.stderr.toString().trimEnd()
          : ''
        const message = [
          `Failed to execute action "${action}" for package ${pkg.name}.`,
          stderr && `stderr:\n${stderr}`,
          stdout && `stdout:\n${stdout}`,
          !stdout && !stderr && execError.message,
        ]
          .filter(Boolean)
          .join('\n')

        throw new Error(message)
      }
    }
  }

  // Done
  console.info('Ran ecosystem-ci successfully.')

  await Promise.resolve()
}
