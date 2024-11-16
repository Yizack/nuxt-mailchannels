import type { MailChannelsEmailRecipient, MailChannelsEmailOptions } from '../types/email'
import type { MailChannelsSetup } from '../index'

export const normalizeRecipient = (recipient?: Partial<MailChannelsEmailRecipient> | string) => {
  if (typeof recipient === 'string') {
    return { email: recipient }
  }

  if (recipient?.email) {
    return { email: recipient.email, name: recipient.name }
  }

  return undefined
}

export const normalizeArrayRecipients = (recipients?: Partial<MailChannelsEmailRecipient> | MailChannelsEmailRecipient[] | string[] | string) => {
  if (!recipients) {
    return undefined
  }

  if (typeof recipients === 'string') {
    return [{ email: recipients }]
  }

  return Array.isArray(recipients) ? recipients.map(recipient => normalizeRecipient(recipient)!) : [recipients as MailChannelsEmailRecipient]
}

const overrideRecipient = (
  target: Partial<MailChannelsEmailRecipient> | string | undefined,
  source?: MailChannelsEmailRecipient | string,
) => {
  const normalizedTarget = normalizeRecipient(target)
  const normalizedSource = normalizeRecipient(source)

  return {
    email: normalizedSource?.email || normalizedTarget?.email,
    name: normalizedSource?.name || normalizedTarget?.name,
  }
}

const overrideArrayRecipients = (
  target: Partial<MailChannelsEmailRecipient> | MailChannelsEmailRecipient[] | string | string[] | undefined,
  source?: MailChannelsEmailRecipient[] | MailChannelsEmailRecipient | string | string[],
) => {
  const normalizedTarget = normalizeArrayRecipients(target)
  const normalizedSource = normalizeArrayRecipients(source)

  const overridedArray = normalizedSource ? normalizedSource : normalizedTarget
  const overrided = overridedArray?.filter(recipient => recipient.email)
  return overrided?.length ? overrided : undefined
}

export const getOverrides = (
  config: MailChannelsSetup['config'],
  sources: Pick<MailChannelsEmailOptions, 'from' | 'to' | 'cc' | 'bcc'>,
) => {
  const from = overrideRecipient(config.from, sources.from)
  if (!from.email) throw new Error('No MailChannels sender provided. Use the `from` option to specify a sender.')

  const to = overrideArrayRecipients(config.to, sources.to)
  if (!to?.length) throw new Error('No MailChannels recipients provided. Use the `to` option to specify at least one recipient.')

  const cc = overrideArrayRecipients(config.cc, sources.cc)
  const bcc = overrideArrayRecipients(config.bcc, sources.bcc)

  return {
    from: { email: from.email ?? '', name: from.name },
    to,
    cc,
    bcc,
  }
}
