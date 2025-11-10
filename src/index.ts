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

  // Clone each repository
  for (const pkg of resolvedOptions.ecosystem) {
    // Determine the package directory
    const pkgDir = path.join(tempDir, pkg.name)

    // Verify if the package directory exists already (unless force is true)
    if (fs.existsSync(pkgDir) && !resolvedOptions.force) {
      console.info(`Package ${pkg.name} already cloned. Skipping clone.`)
    }
    // Else, clone the repository
    else {
      console.info(`Cloning package ${pkg.name} into ${pkgDir}...`)
      await cloneRepo(pkg.repository, pkgDir)
    }
  }

  // Run actions for each package
  for (const pkg of resolvedOptions.ecosystem) {
    const pkgDir = path.join(tempDir, pkg.name)
    console.info(`Running actions for package ${pkg.name}...`)

    for (const action of pkg.actions) {
      console.info(`  Executing action: ${action}`)
      const childProcess = await import('node:child_process')
      childProcess.execSync(action, {
        cwd: pkgDir,
        env: {
          ...process.env,
        },
        stdio: ['inherit', 'ignore', 'inherit'],
      })
    }
  }

  await Promise.resolve()
}
