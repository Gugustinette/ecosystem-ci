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
}

export interface Options {
  /**
   * Name of the ecosystem-ci configuration.
   * @default 'ecosystem-ci'
   */
  name?: string

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
