export interface GithubRepositoryConfig {
  /**
   * GitHub repository in the form of `owner/name`.
   */
  repo: string

  /**
   * Branch to clone. Defaults to `main` when neither branch nor commit is provided.
   */
  branch?: string

  /**
   * Commit SHA to clone. Takes precedence over branch when provided.
   */
  commit?: string
}

export interface RepositoryObject {
  /**
   * Direct URL supported by giget (e.g. tarball URL).
   */
  url?: string

  /**
   * GitHub repository descriptor.
   */
  github?: GithubRepositoryConfig
}

export type RepositoryDescriptor = string | RepositoryObject

export type PackageAction = string | (() => unknown | Promise<unknown>)

export type PatchFileHandler = (content: string) => string

export interface EcosystemPackage {
  /**
   * Name of the package in the ecosystem.
   */
  name: string

  /**
   * Repository location (string shorthand or object descriptor).
   */
  repository: RepositoryDescriptor

  /**
   * Additional pnpm overrides for this package.
   * @example
   * ```jsonc
   * {
   *   // Override the version of "my-package" when imported by "vite"
   *   "vite@*>my-package": "file:../../"
   * }
   * ```
   */
  pnpmOverrides?: Record<string, string>

  /**
   * Optional file patches executed before actions.
   */
  patchFiles?: Record<string, PatchFileHandler>

  /**
   * Actions to perform for this package.
   */
  actions: PackageAction[]
}

export interface Options {
  /**
   * Name of the ecosystem-ci configuration.
   * @default 'ecosystem-ci'
   */
  name?: string

  /**
   * String to replace npm import with within cloned repositories.
   * @default 'file:../../[name]'
   */
  npmImportReplacement?: string

  /**
   * Relative path to the package under test (useful for monorepos).
   * @default '.'
   */
  packageLocation?: string

  /**
   * Debug mode.
   * @default false
   */
  debug?: boolean

  /**
   * Force re-cloning of repositories.
   * @default false
   */
  force?: boolean

  /**
   * The ecosystem to run the CI against.
   */
  ecosystem: EcosystemPackage[]
}

export interface ResolvedOptions {
  /**
   * Name of the ecosystem-ci configuration.
   * @default 'ecosystem-ci'
   */
  name: string

  /**
   * String to replace npm import with within cloned repositories.
   * @default Derived from `packageLocation` (e.g. 'file:../../packages/foo')
   */
  npmImportReplacement: string

  /**
   * Relative path to the package under test (useful for monorepos).
   * @default '.'
   */
  packageLocation: string

  /**
   * Debug mode.
   * @default false
   */
  debug: boolean

  /**
   * Force re-cloning of repositories.
   * @default false
   */
  force: boolean

  /**
   * The ecosystem to run the CI against.
   */
  ecosystem: EcosystemPackage[]
}
