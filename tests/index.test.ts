import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import { captureConsole } from './utils/capture-console'
import { normalizeOutput } from './utils/normalize-output'
import { runCli } from './utils/run-cli'

describe('ecosystem-ci', () => {
  test('should run with mocked unrun successfully', async () => {
    const fixtureDir = fileURLToPath(
      new URL('fixtures/unrun/', import.meta.url),
    )

    // Capture console output
    const { stdout, stderr } = await captureConsole(() =>
      runCli([], { cwd: fixtureDir }),
    )

    // Snapshot console output
    expect({
      stdout: normalizeOutput(stdout, fixtureDir),
      stderr: normalizeOutput(stderr, fixtureDir),
    }).toMatchSnapshot('unrun-console')
  })

  test('should throw error with intentional unrun failure', async () => {
    const fixtureDir = fileURLToPath(
      new URL('fixtures/unrun-error/', import.meta.url),
    )

    let exitError: unknown

    // Capture console output even when the CLI terminates with process.exit
    const { stderr } = await captureConsole(async () => {
      try {
        await runCli([], { cwd: fixtureDir })
      } catch (error) {
        exitError = error
      }
    })

    expect(exitError).toBeInstanceOf(Error)
    expect((exitError as Error).message).toBe(
      'process.exit unexpectedly called with "1"',
    )
    expect(stderr).toContain('Force throw for testing purposes')
  })
})
