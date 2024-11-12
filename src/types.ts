export interface NuxtMailChannelsOptions {
  /**
   * Sender settings
   */
  from: {
    /**
     * Default email address
     *
     * Default email address to use when sending emails
     *
     * @default undefined
     */
    email?: string
    /**
     * Default sender name
     *
     * Default name to use when sending emails
     *
     * @default undefined
     */
    name?: string
  }
}

export type ModuleOptions = NuxtMailChannelsOptions
