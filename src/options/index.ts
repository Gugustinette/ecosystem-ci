import type { Options, ResolvedOptions } from './types'

const DEFAULT_PACKAGE_LOCATION = '.'

export function resolveOptions(options: Options): ResolvedOptions {
  const packageLocation = normalizePackageLocation(options.packageLocation)

  const resolvedOptions: ResolvedOptions = {
    name: options.name || 'ecosystem-ci',
    packageLocation,
    npmImportReplacement:
      options.npmImportReplacement ||
      buildDefaultImportReplacement(packageLocation),
    debug: options.debug || false,
    force: options.force || false,
    ecosystem: options.ecosystem || [],
  }
  return resolvedOptions
}

function normalizePackageLocation(location?: string): string {
  if (!location) return DEFAULT_PACKAGE_LOCATION
  const trimmed = location.trim()
  if (trimmed === '' || trimmed === '.' || trimmed === './') {
    return DEFAULT_PACKAGE_LOCATION
  }
  const normalized = trimmed
    .replaceAll('\\', '/')
    .replace(/^\.\//, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')

  return normalized || DEFAULT_PACKAGE_LOCATION
}

function buildDefaultImportReplacement(packageLocation: string): string {
  const normalized =
    packageLocation === DEFAULT_PACKAGE_LOCATION
      ? ''
      : packageLocation.replace(/\/+$/, '')

  return `file:../../${normalized}`
}
