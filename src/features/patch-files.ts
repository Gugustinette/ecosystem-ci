import fs from 'node:fs'
import path from 'node:path'
import type { PatchFileHandler } from '../options/types'

export function applyPatchFiles(
  packageName: string,
  pkgDir: string,
  patches?: Record<string, PatchFileHandler>,
): void {
  if (!patches) return

  for (const [relativeFilePath, patch] of Object.entries(patches)) {
    const targetPath = path.join(pkgDir, relativeFilePath)
    if (!fs.existsSync(targetPath)) {
      throw new TypeError(
        `Cannot patch missing file ${relativeFilePath} for package ${packageName}.`,
      )
    }
    const originalContent = fs.readFileSync(targetPath, 'utf8')
    const nextContent = patch(originalContent)
    if (typeof nextContent !== 'string') {
      throw new TypeError(
        `Patch for ${relativeFilePath} in package ${packageName} must return a string.`,
      )
    }

    if (nextContent !== originalContent) {
      fs.writeFileSync(targetPath, nextContent, 'utf8')
      console.info(
        `Applied patch to ${relativeFilePath} for package ${packageName}.`,
      )
    }
  }
}
