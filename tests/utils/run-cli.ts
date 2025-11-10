import process from 'node:process'
import { vi } from 'vitest'

export interface RunCliOptions {
  cwd?: string
}

export async function runCli(
  args: string[] = [],
  options: RunCliOptions = {},
): Promise<void> {
  const cliUrl = new URL('../../dist/cli.mjs', import.meta.url)
  const previousArgv = process.argv
  const previousCwd = process.cwd()

  try {
    if (options.cwd) {
      process.chdir(options.cwd)
    }

    process.argv = ['node', 'ecosystem-ci', '--force', ...args]

    vi.resetModules()
    await import(cliUrl.href)
  } finally {
    process.argv = previousArgv
    if (options.cwd) {
      process.chdir(previousCwd)
    }
  }
}
