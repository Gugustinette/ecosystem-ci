import { execSync, type ExecException } from 'node:child_process'
import process from 'node:process'
import type { PackageAction } from '../options/types'

export async function runPackageActions(
  packageName: string,
  pkgDir: string,
  actions: PackageAction[] = [],
): Promise<void> {
  console.info(`Running actions for package ${packageName}...`)
  for (const action of actions) {
    if (typeof action === 'string') {
      console.info(`  Executing action: ${action}`)
      try {
        execSync(action, {
          cwd: pkgDir,
          env: {
            ...process.env,
          },
          stdio: 'pipe',
        })
      } catch (error) {
        throw buildActionError(error as ExecException, action, packageName)
      }
    } else {
      const name = action.name || 'anonymous function'
      console.info(`  Executing action: [function ${name}]`)
      await Promise.resolve(action())
    }
  }
}

function buildActionError(
  execError: ExecException,
  action: string,
  packageName: string,
): Error {
  const stdout = execError.stdout ? execError.stdout.toString().trimEnd() : ''
  const stderr = execError.stderr ? execError.stderr.toString().trimEnd() : ''
  const message = [
    `Failed to execute action "${action}" for package ${packageName}.`,
    stderr && `stderr:\n${stderr}`,
    stdout && `stdout:\n${stdout}`,
    !stdout && !stderr && execError.message,
  ]
    .filter(Boolean)
    .join('\n')

  return new Error(message)
}
