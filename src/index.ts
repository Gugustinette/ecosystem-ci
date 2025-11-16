import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { runPackageActions } from './features/actions'
import { updatePackageManifest } from './features/package-manifest'
import { applyPatchFiles } from './features/patch-files'
import { resolveOptions } from './options'
import { cloneRepo } from './utils/clone-repo'
import { resolveRepo } from './utils/resolve-repo'
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
      const repositorySource = resolveRepo(pkg.repository)
      await cloneRepo(repositorySource, pkgDir)
    }
  }

  // Files corrections
  for (const pkg of resolvedOptions.ecosystem) {
    const pkgDir = path.join(tempDir, pkg.name)
    // Update manifests
    updatePackageManifest(pkg, pkgDir, resolvedOptions)
    // Apply patches
    applyPatchFiles(pkg.name, pkgDir, pkg.patchFiles)
  }

  // Run actions for each package
  for (const pkg of resolvedOptions.ecosystem) {
    const pkgDir = path.join(tempDir, pkg.name)
    await runPackageActions(pkg.name, pkgDir, pkg.actions)
  }

  // Done
  console.info('Ran ecosystem-ci successfully.')

  await Promise.resolve()
}
