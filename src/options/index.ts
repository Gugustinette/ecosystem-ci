import type { Options, ResolvedOptions } from './types'

export function resolveOptions(options: Options): ResolvedOptions {
  const resolvedOptions: ResolvedOptions = {
    name: options.name || 'ecosystem-ci',
    npmImportReplacement:
      options.npmImportReplacement ||
      `file:../../${options.name ?? 'ecosystem-ci'}`,
    debug: options.debug || false,
    force: options.force || false,
    ecosystem: options.ecosystem || [],
  }
  return resolvedOptions
}
