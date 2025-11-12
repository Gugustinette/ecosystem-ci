import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import { normalizeOutput } from './utils/normalize-output'
import { runCli } from './utils/run-cli'

describe('ecosystem-ci', () => {
  test('should apply basic npm file:../../ override (tsdown-obug success)', () => {
    const fixtureDir = fileURLToPath(
      new URL('fixtures/tsdown-obug/', import.meta.url),
    )

    // Run ecosystem-ci
    const result = runCli({ cwd: fixtureDir })

    // Snapshot console output
    expect({
      stdout: normalizeOutput(result.stdout, fixtureDir),
      stderr: normalizeOutput(result.stderr, fixtureDir),
    }).toMatchSnapshot('ecosystem-ci-output')
    // Check exit status
    expect(result.status).toBe(0)
  })

  test('should apply basic npm file:../../ override (tsdown-obug failure)', () => {
    const fixtureDir = fileURLToPath(
      new URL('fixtures/tsdown-obug-error/', import.meta.url),
    )

    // Run ecosystem-ci
    const result = runCli({ cwd: fixtureDir })

    // Snapshot console output
    expect({
      stdout: normalizeOutput(result.stdout, fixtureDir),
      stderr: normalizeOutput(result.stderr, fixtureDir),
    }).toMatchSnapshot('ecosystem-ci-output')
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

    // Snapshot console output
    expect({
      stdout: normalizeOutput(result.stdout, fixtureDir),
      stderr: normalizeOutput(result.stderr, fixtureDir),
    }).toMatchSnapshot('ecosystem-ci-output')
    // Check exit status
    expect(result.status).toBe(0)
  })

  test('should apply pnpm override (vite-unrun failure on Node 20)', () => {
    const fixtureDir = fileURLToPath(
      new URL('fixtures/vite-unrun-error-node-20/', import.meta.url),
    )

    // Run ecosystem-ci
    const result = runCli({ cwd: fixtureDir })

    // Error only happens on Node.js <= 20
    // as tsdown won't use unrun on Node.js > 20
    const nodeMajor = Number(process.versions.node.split('.')[0])
    if (Number.isNaN(nodeMajor) || nodeMajor <= 20) {
      // Snapshot console output
      expect({
        stdout: normalizeOutput(result.stdout, fixtureDir),
        stderr: normalizeOutput(result.stderr, fixtureDir),
      }).toMatchSnapshot('ecosystem-ci-output')
      // Check exit status
      expect(result.status).toBe(1)
      expect(result.stderr).toContain('Intentional unrun failure on Node 20')
    } else {
      // Snapshot console output
      expect({
        stdout: normalizeOutput(result.stdout, fixtureDir),
        stderr: normalizeOutput(result.stderr, fixtureDir),
      }).toMatchSnapshot('ecosystem-ci-output')
    }
  })
})
