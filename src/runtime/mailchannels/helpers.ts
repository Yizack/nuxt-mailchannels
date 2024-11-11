import type { MailChannelsEmailRecipient } from './types/email'

export const normalizeRecipients = (recipients: MailChannelsEmailRecipient[] | MailChannelsEmailRecipient | string[] | string) => {
  if (typeof recipients === 'string') {
    return [{ email: recipients }]
  }

  return Array.isArray(recipients) ? recipients.map(recipient => typeof recipient === 'string' ? { email: recipient } : recipient) : [recipients]
}
