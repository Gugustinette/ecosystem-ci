import fs from 'node:fs'
import path from 'node:path'
import type { EcosystemPackage, ResolvedOptions } from '../options/types'

export function updatePackageManifest(
  pkg: EcosystemPackage,
  pkgDir: string,
  resolvedOptions: ResolvedOptions,
): void {
  const packageJsonPath = path.join(pkgDir, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as {
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
    pnpm?: { overrides?: Record<string, string> }
  }

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

  replaceImport(packageJson.dependencies)
  replaceImport(packageJson.devDependencies)

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

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
    'utf8',
  )
}
