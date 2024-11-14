import type { MailChannelsEmailRecipient } from '../types/email'
import type { MailChannels } from '../index'

export const normalizeRecipient = (recipient?: Partial<MailChannelsEmailRecipient> | string) => {
  if (typeof recipient === 'string') {
    return { email: recipient }
  }

  if (recipient?.email) {
    return { email: recipient.email, name: recipient.name }
  }

  return undefined
}

export const normalizeArrayRecipients = (recipients: MailChannelsEmailRecipient[] | MailChannelsEmailRecipient | string[] | string | undefined) => {
  if (!recipients) {
    return undefined
  }

  if (typeof recipients === 'string') {
    return [{ email: recipients }]
  }

  return Array.isArray(recipients) ? recipients.map(recipient => normalizeRecipient(recipient)!) : [recipients]
}

export const ensureToAndFrom = (
  context: MailChannels,
  from: Partial<MailChannelsEmailRecipient> | string | undefined,
  to: MailChannelsEmailRecipient[] | MailChannelsEmailRecipient | string[] | string | undefined,
) => {
  const normalizedFrom = normalizeRecipient(from)
  const fromDefaults = {
    email: normalizedFrom?.email || context['config'].from.email || '',
    name: normalizedFrom?.name || context['config'].from.name,
  }
  const toRecipients = normalizeArrayRecipients(to)

  if (!fromDefaults?.email) {
    throw new Error('No MailChannels sender provided. Use the `from` option to specify a sender.')
  }

  if (!toRecipients?.length) {
    throw new Error('No MailChannels recipients provided. Use the `to` option to specify at least one recipient.')
  }

  return { from: fromDefaults, to: toRecipients }
}
