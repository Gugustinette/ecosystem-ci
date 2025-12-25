import { defineConfig, type ResolvedOptions } from '../../../../src'

const _default_1: ResolvedOptions = defineConfig({
  name: 'f1-dependency',
  ecosystem: [
    {
      name: 'f1-dependent',
      repository:
        'gh:gugustinette/ecosystem-ci/tests/fixtures/f1/dependent#main',
      actions: ['pnpm i --no-frozen-lockfile', 'pnpm run start'],
    },
  ],
})
export default _default_1
