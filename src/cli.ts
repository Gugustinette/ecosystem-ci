import process from 'node:process'
import { dim } from 'ansis'
import { cac } from 'cac'
import pkg from '../package.json' with { type: 'json' }
import { loadConfig } from './config/load-config'
import type { Options } from './options/types'
import { ecosystemCi } from './index'

const cli = cac('ecosystem-ci')
cli.help().version(pkg.version)

interface CliOptions {
  config?: string
  debug?: boolean
}

interface ResolvedCliOptions {
  config: string
  debug: boolean
}

cli
  .command('', 'Run ecosystem-ci', {
    ignoreOptionDefaultValue: true,
    allowUnknownOptions: true,
  })
  .option('-c, --config <filename>', 'Use a custom config file')
  .option('--debug', 'Enable debug mode')
  .action(async (options: CliOptions) => {
    console.info(`ecosystem-ci ${dim`v${pkg.version}`}`)

    // Resolve Cli options
    const resolvedCliOptions: ResolvedCliOptions = {
      config: options.config || 'ecosystem-ci.config.ts',
      debug: options.debug || false,
    }

    // Load config file
    const config: Options = await loadConfig(resolvedCliOptions.config)

    // Run ecosystem-ci
    await ecosystemCi({
      debug: resolvedCliOptions.debug,
      ...config,
    })
  })

export async function runCLI(): Promise<void> {
  cli.parse(process.argv, { run: false })

  try {
    await cli.runMatchedCommand()
  } catch {
    process.exit(1)
  }
}

await runCLI()
