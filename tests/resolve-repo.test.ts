import { describe, expect, test } from 'vitest'
import { resolveRepo } from '../src/utils/resolve-repo'

describe('resolveRepo', () => {
  test('returns string repositories untouched', () => {
    expect(resolveRepo('gh:org/repo')).toBe('gh:org/repo')
  })

  test('builds github shorthand from object', () => {
    expect(
      resolveRepo({
        github: {
          repo: 'org/repo',
          branch: 'develop',
        },
      }),
    ).toBe('github:org/repo#develop')
  })

  test('prefers commit over branch', () => {
    expect(
      resolveRepo({
        github: {
          repo: 'org/repo',
          branch: 'develop',
          commit: 'f2fe3c4',
        },
      }),
    ).toBe('github:org/repo#f2fe3c4')
  })
})
