import type { MailChannelsEmailRecipient } from './runtime/mailchannels/types/email'

export interface NuxtMailChannelsOptions {
  /**
   * Set default BCC
   */
  bcc: Partial<MailChannelsEmailRecipient> | MailChannelsEmailRecipient[] | string | string[] | undefined
  /**
   * Set default CC
   */
  cc: Partial<MailChannelsEmailRecipient> | MailChannelsEmailRecipient[] | string | string[] | undefined
  /**
   * Set a default sender
   */
  from: Partial<MailChannelsEmailRecipient> | string | undefined
  /**
   * Set default recipient
   */
  to: Partial<MailChannelsEmailRecipient> | MailChannelsEmailRecipient[] | string | string[] | undefined
}

export type ModuleOptions = NuxtMailChannelsOptions
