import { defineConfig, type ResolvedOptions } from '../../../src'

const _default_1: ResolvedOptions = defineConfig({
  name: 'unrun',
  packageLocation: './packages/unrun',
  ecosystem: [
    {
      name: 'vite',
      repository: {
        github: {
          repo: 'vitejs/vite',
          branch: 'main',
        },
      },
      actions: ['node -e "console.log(\'vite monorepo fixture\')"'],
      pnpmOverrides: {
        'tsdown@*>unrun': 'file:../../packages/unrun',
      },
      patchFiles: {
        'package.json': (content) => {
          const parsed = JSON.parse(content)
          parsed.devDependencies = parsed.devDependencies || {}
          parsed.devDependencies.unrun =
            parsed.devDependencies.unrun || 'workspace:*'
          return JSON.stringify(parsed, null, 2)
        },
      },
    },
  ],
})

export default _default_1
