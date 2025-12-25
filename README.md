# ecosystem-ci

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Unit Test][unit-test-src]][unit-test-href]

Run CI across the ecosystem

## Install

```bash
npm i -D ecosystem-ci
```

## Usage

1. Create an `ecosystem-ci.config.ts` file at the root of your project. The
   config exports `defineConfig` and describes where your package lives, how
   to replace its dependency inside downstream repositories, and which
   actions to run in each ecosystem package.

```ts
import { defineConfig } from 'ecosystem-ci'

export default defineConfig({
  // required: name of the package to test in downstream repositories
  name: 'my-package',
  // optional: override the default '.' location
  packageLocation: './packages/my-package',
  // optional: override the default "file:../../packages/my-package" replacement
  npmImportReplacement: 'file:../../packages/my-package',
  // describe the ecosystem repositories to test against
  ecosystem: [
    {
      name: 'vite',
      repository: {
        github: {
          repo: 'vitejs/vite',
          branch: 'main',
        },
      },
      // optional: for pnpm monorepos, force my-package to be used when vite depends on it
      pnpmOverrides: {
        'vite@*>my-package': 'file:../../packages/my-package',
      },
      // optional: patch files before running actions
      patchFiles: {
        'package.json': (content) =>
          content.replace('workspace:*', 'file:../../packages/my-package'),
      },
      // actions to run in the cloned repository
      actions: [
        'pnpm install --no-frozen-lockfile',
        'pnpm run build',
        // you can also use a functions instead of string commands
        () => {},
        'pnpm run test-unit',
      ],
    },
  ],
})
```

2. Run the CLI in the same directory to clone and test your ecosystem:

```bash
npx ecosystem-ci
```

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/test-ecosystem-ci.svg
[npm-version-href]: https://npmjs.com/package/test-ecosystem-ci
[npm-downloads-src]: https://img.shields.io/npm/dm/test-ecosystem-ci
[npm-downloads-href]: https://www.npmcharts.com/compare/test-ecosystem-ci?interval=30
[unit-test-src]: https://github.com/gugustinette/ecosystem-ci/actions/workflows/unit-test.yml/badge.svg
[unit-test-href]: https://github.com/gugustinette/ecosystem-ci/actions/workflows/unit-test.yml
