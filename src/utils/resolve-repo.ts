import type { RepositoryDescriptor } from '../options/types'

const DEFAULT_BRANCH = 'main'

export function resolveRepo(descriptor: RepositoryDescriptor): string {
  if (typeof descriptor === 'string') {
    return descriptor
  }

  if (descriptor.url) {
    return descriptor.url
  }

  if (descriptor.github) {
    const { repo, branch, commit } = descriptor.github
    if (!repo) {
      throw new TypeError('GitHub repository name is required.')
    }
    const ref = commit || branch || DEFAULT_BRANCH
    return `github:${repo}${ref ? `#${ref}` : ''}`
  }

  throw new TypeError('Invalid repository descriptor provided.')
}
