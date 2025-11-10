import { defineConfig, type ResolvedOptions } from '../../../src'

const _default_1: ResolvedOptions = defineConfig({
  name: 'vite-ecosystem-ci',
  ecosystem: [
    {
      name: 'vite',
      repository: 'gh:vitejs/vite',
      actions: ['pnpm i', 'pnpm run build', 'pnpm run test-unit'],
    },
  ],
})
export default _default_1
