import { spawnSync } from 'node:child_process'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

export interface RunCliOptions {
  args?: string[]
  cwd?: string
}

export interface RunCliResult {
  stdout: string
  stderr: string
  status: number | null
}

export function runCli(options: RunCliOptions = {}): RunCliResult {
  // Store original working directory
  const originalCwd = process.cwd()

  // Prepare CLI execution
  const nodePath = process.execPath
  const cliUrl = new URL('../../dist/cli.mjs', import.meta.url)
  const cliArgv = [
    '--force',
    '--config-loader',
    'unrun',
    ...(options.args || []),
  ]
  const cliCwd = options.cwd || process.cwd()

  try {
    // Change working directory
    process.chdir(cliCwd)

    // Run the CLI in a child process and capture stdout/stderr
    const result = spawnSync(nodePath, [fileURLToPath(cliUrl), ...cliArgv], {
      cwd: cliCwd,
      encoding: 'utf8',
      stdio: 'pipe',
    })

    if (result.error) {
      throw result.error
    }

    return {
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      status: result.status,
    }
  } finally {
    // Restore original working directory
    process.chdir(originalCwd)
  }
}
