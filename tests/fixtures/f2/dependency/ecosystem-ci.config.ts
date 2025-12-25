import { defineConfig, type ResolvedOptions } from '../../../../src'

const _default_f2: ResolvedOptions = defineConfig({
  name: 'f2-dependency',
  packageLocation: './packages/f2-dependency',
  ecosystem: [
    {
      name: 'f2-dependent',
      repository:
        'gh:gugustinette/ecosystem-ci/tests/fixtures/f2/dependent#main',
      actions: ['pnpm i --no-frozen-lockfile', 'pnpm run start'],
      pnpmOverrides: {
        'f2-dependent@*>f2-dependency': 'file:../../packages/f2-dependency',
      },
    },
  ],
})

export default _default_f2
