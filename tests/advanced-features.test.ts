import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { describe, expect, test } from 'vitest'
import { ecosystemCi } from '../src'

describe('ecosystem-ci advanced features', () => {
  test('applies patchFiles and function actions before commands', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecosystem-ci-'))
    const originalCwd = process.cwd()
    process.chdir(tmpDir)
    try {
      const packageLocation = path.join('packages', 'cli')
      const localPackageDir = path.join(tmpDir, packageLocation)
      fs.mkdirSync(localPackageDir, { recursive: true })
      fs.writeFileSync(
        path.join(localPackageDir, 'package.json'),
        JSON.stringify(
          {
            name: 'monopkg',
            version: '0.0.0',
          },
          null,
          2,
        ),
      )

      const pkgDir = path.join(tmpDir, '.ecosystem-ci', 'dummy')
      fs.mkdirSync(pkgDir, { recursive: true })
      fs.writeFileSync(
        path.join(pkgDir, 'package.json'),
        JSON.stringify(
          {
            name: 'dummy',
            dependencies: {
              monopkg: 'latest',
            },
          },
          null,
          2,
        ),
      )
      fs.writeFileSync(path.join(pkgDir, 'patched.txt'), 'original', 'utf8')

      let functionRuns = 0

      await ecosystemCi({
        name: 'monopkg',
        packageLocation: './packages/cli',
        ecosystem: [
          {
            name: 'dummy',
            repository: {
              url: 'https://example.com/dummy.tar.gz',
            },
            patchFiles: {
              'patched.txt': (content) =>
                content.replace('original', 'patched'),
            },
            actions: [
              () => {
                functionRuns += 1
                const patchedContent = fs.readFileSync(
                  path.join(pkgDir, 'patched.txt'),
                  'utf8',
                )
                expect(patchedContent).toBe('patched')
              },
              'node -e "process.exit(0)"',
            ],
          },
        ],
      })

      const updatedPackageJson = JSON.parse(
        fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'),
      ) as { dependencies: Record<string, string> }

      expect(updatedPackageJson.dependencies.monopkg).toBe(
        'file:../../packages/cli',
      )
      expect(functionRuns).toBe(1)
    } finally {
      process.chdir(originalCwd)
      fs.rmSync(tmpDir, { recursive: true, force: true })
    }
  })
})
