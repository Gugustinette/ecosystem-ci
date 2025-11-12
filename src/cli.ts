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
  configLoader?: 'auto' | 'native' | 'unrun'
  debug?: boolean
  force?: boolean
}

interface ResolvedCliOptions {
  config: string
  configLoader: 'auto' | 'native' | 'unrun'
  debug: boolean
  force: boolean
}

cli
  .command('', 'Run ecosystem-ci', {
    ignoreOptionDefaultValue: true,
    allowUnknownOptions: true,
  })
  .option('-c, --config <filename>', 'Use a custom config file')
  .option(
    '--config-loader <loader>',
    'Specify config loader (auto | native | unrun)',
  )
  .option('--debug', 'Enable debug mode')
  .option('--force', 'Force re-cloning of repositories')
  .action(async (options: CliOptions) => {
    console.info(`Running ${dim('ecosystem-ci')}...`)

    // Resolve Cli options
    const resolvedCliOptions: ResolvedCliOptions = {
      config: options.config || 'ecosystem-ci.config',
      configLoader: options.configLoader || 'auto',
      debug: options.debug || false,
      force: options.force || false,
    }

    // Load config file
    const config: Options = await loadConfig(
      resolvedCliOptions.configLoader,
      resolvedCliOptions.config,
    )

    // Run ecosystem-ci
    await ecosystemCi({
      ...config,
      debug: resolvedCliOptions.debug,
      force: resolvedCliOptions.force,
    })
  })

export async function runCLI(): Promise<void> {
  cli.parse(process.argv, { run: false })

  try {
    await cli.runMatchedCommand()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

await runCLI()
