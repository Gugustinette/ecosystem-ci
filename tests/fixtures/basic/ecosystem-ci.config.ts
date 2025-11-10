import { defineConfig, type ResolvedOptions } from '../../../src'

const _default_1: ResolvedOptions = defineConfig({
  name: 'vite-ecosystem-ci',
  ecosystem: [
    {
      name: 'vite',
      actions: ['pnpm i', 'pnpm run build'],
    },
  ],
})
export default _default_1
