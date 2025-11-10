export interface EcosystemPackage {
  /**
   * Name of the package in the ecosystem.
   */
  name: string

  /**
   * Repository URL (e.g. 'https://api.github.com/repos/[OWNER]/[REPOSITORY]/tarball/main')
   * or shorthand (e.g., 'gh:[OWNER]/[REPOSITORY]')
   * of the package.
   */
  repository: string

  /**
   * Actions to perform for this package.
   */
  actions: string[]

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
   * @default 'file:../../[name]'
   */
  npmImportReplacement: string

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
