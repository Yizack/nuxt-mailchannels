import type { EmailsSendRecipient } from 'mailchannels-sdk/modules'

export interface NuxtMailChannelsOptions {
  /**
   * Set default BCC
   */
  bcc: Partial<EmailsSendRecipient> | EmailsSendRecipient[] | string | string[] | undefined
  /**
   * Set default CC
   */
  cc: Partial<EmailsSendRecipient> | EmailsSendRecipient[] | string | string[] | undefined
  /**
   * Set a default sender
   */
  from: Partial<EmailsSendRecipient> | string | undefined
  /**
   * Set default recipient
   */
  to: Partial<EmailsSendRecipient> | EmailsSendRecipient[] | string | string[] | undefined
}

export type ModuleOptions = NuxtMailChannelsOptions
