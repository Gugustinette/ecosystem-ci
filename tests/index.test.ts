import { fileURLToPath } from 'node:url'
import { test } from 'vitest'
import { runCli } from './utils/run-cli'

test('runs cli against basic fixture', async () => {
  const fixtureDir = fileURLToPath(new URL('fixtures/basic/', import.meta.url))
  await runCli([], { cwd: fixtureDir })
})
