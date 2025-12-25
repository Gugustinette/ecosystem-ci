import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import { runCli } from './utils/run-cli'

describe('ecosystem-ci', () => {
  test('should apply basic npm file:../../ override', () => {
    const fixtureDir = fileURLToPath(
      new URL('fixtures/f1/dependency/', import.meta.url),
    )

    // Run ecosystem-ci
    const result = runCli({ cwd: fixtureDir })
    if (result.stderr) {
      throw new Error(result.stderr)
    }

    // Check exit status
    expect(result.status).toBe(0)
  })

  test('should apply pnpm overrides and handle monorepo fixture', () => {
    const fixtureDir = fileURLToPath(
      new URL('fixtures/f2/dependency/', import.meta.url),
    )

    const result = runCli({ cwd: fixtureDir })
    if (result.stderr) {
      throw new Error(result.stderr)
    }

    expect(result.status).toBe(0)

    const packageJsonPath = path.join(
      fixtureDir,
      '.ecosystem-ci',
      'f2-dependent',
      'package.json',
    )
    const packageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, 'utf8'),
    ) as {
      dependencies?: Record<string, string>
      pnpm?: { overrides?: Record<string, string> }
    }

    expect(packageJson.dependencies?.['f2-dependency']).toBe(
      'file:../../packages/f2-dependency',
    )
    expect(packageJson.pnpm?.overrides?.['f2-dependent@*>f2-dependency']).toBe(
      'file:../../packages/f2-dependency',
    )
  })
})
