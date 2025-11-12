import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import { runCli } from './utils/run-cli'

describe('ecosystem-ci', () => {
  test('should apply basic npm file:../../ override (tsdown-obug success)', () => {
    const fixtureDir = fileURLToPath(
      new URL('fixtures/tsdown-obug/', import.meta.url),
    )

    // Run ecosystem-ci
    const result = runCli({ cwd: fixtureDir })

    // Check exit status
    expect(result.status).toBe(0)
  })

  test('should apply basic npm file:../../ override (tsdown-obug failure)', () => {
    const fixtureDir = fileURLToPath(
      new URL('fixtures/tsdown-obug-error/', import.meta.url),
    )

    // Run ecosystem-ci
    const result = runCli({ cwd: fixtureDir })

    // Check exit status
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Intentional failure from obug package')
  })

  test('should apply pnpm override (vite-unrun success)', () => {
    const fixtureDir = fileURLToPath(
      new URL('fixtures/vite-unrun/', import.meta.url),
    )

    // Run ecosystem-ci
    const result = runCli({ cwd: fixtureDir })

    // Check exit status
    expect(result.status).toBe(0)
  })

  test('should apply pnpm override (vite-unrun failure)', () => {
    const fixtureDir = fileURLToPath(
      new URL('fixtures/vite-unrun-error/', import.meta.url),
    )

    // Run ecosystem-ci
    const result = runCli({ cwd: fixtureDir })

    // Error only happens if typescript is available
    // otherwise tsdown won't use unrun
    if (process.features.typescript) {
      // Check exit status
      expect(result.status).toBe(0)
    } else {
      // Check exit status
      expect(result.status).toBe(1)
      expect(result.stderr).toContain('Intentional unrun failure')
    }
  })
})
