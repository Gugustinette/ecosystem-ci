export interface EcosystemPackage {
  /**
   * Name of the package in the ecosystem.
   */
  name: string

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
   * The ecosystem to run the CI against.
   */
  ecosystem: EcosystemPackage[]
}
