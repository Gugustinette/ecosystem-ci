import { resolveOptions } from './options'
import type { Options } from './options/types'
export { defineConfig } from './config/define-config'
export type { Options, ResolvedOptions } from './options/types'

export async function ecosystemCi(options: Options): Promise<void> {
  // Load config
  // Resolve options
  const resolvedOptions = resolveOptions(options)
  console.log('Running ecosystem-ci with options:', resolvedOptions)
  await Promise.resolve()
}
