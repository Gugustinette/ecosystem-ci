import { resolveOptions } from '../options'
import type { Options, ResolvedOptions } from '../options/types'

export function defineConfig(options: Options): ResolvedOptions {
  return resolveOptions(options)
}
