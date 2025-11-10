import type { Options, ResolvedOptions } from './types'

export function resolveOptions(options: Options): ResolvedOptions {
  const resolvedOptions: ResolvedOptions = {
    name: options.name || 'ecosystem-ci',
    debug: options.debug || false,
    ecosystem: options.ecosystem || [],
  }
  return resolvedOptions
}
