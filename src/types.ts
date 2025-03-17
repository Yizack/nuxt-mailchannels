import type { SendRecipient } from '@yizack/mailchannels'

export interface NuxtMailChannelsOptions {
  /**
   * Set default BCC
   */
  bcc: Partial<SendRecipient> | SendRecipient[] | string | string[] | undefined
  /**
   * Set default CC
   */
  cc: Partial<SendRecipient> | SendRecipient[] | string | string[] | undefined
  /**
   * Set a default sender
   */
  from: Partial<SendRecipient> | string | undefined
  /**
   * Set default recipient
   */
  to: Partial<SendRecipient> | SendRecipient[] | string | string[] | undefined
}

export type ModuleOptions = NuxtMailChannelsOptions
