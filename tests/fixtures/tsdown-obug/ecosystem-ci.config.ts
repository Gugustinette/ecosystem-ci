import { defineConfig, type ResolvedOptions } from '../../../src'

const _default_1: ResolvedOptions = defineConfig({
  name: 'obug',
  ecosystem: [
    {
      name: 'tsdown',
      repository: 'gh:rolldown/tsdown',
      actions: [
        'pnpm i --no-frozen-lockfile',
        'pnpm run build',
        'pnpm vitest run',
      ],
    },
  ],
})
export default _default_1
