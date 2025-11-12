import { defineConfig, type ResolvedOptions } from '../../../src'

const _default_1: ResolvedOptions = defineConfig({
  name: 'unrun',
  ecosystem: [
    {
      name: 'vite',
      repository: 'gh:vitejs/vite',
      actions: [
        'pnpm i --no-frozen-lockfile',
        'pnpm run build',
        'pnpm run test-unit',
      ],
      pnpmOverrides: {
        'tsdown@*>unrun': 'file:../../',
      },
    },
  ],
})
export default _default_1
