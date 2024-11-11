import type { MailChannelsEmailRecipient } from './types/emails'

export const normalizeRecipients = (recipients: MailChannelsEmailRecipient[] | MailChannelsEmailRecipient | string) => {
  if (typeof recipients === 'string') {
    return [{ email: recipients }]
  }

  return Array.isArray(recipients) ? recipients : [recipients]
}
