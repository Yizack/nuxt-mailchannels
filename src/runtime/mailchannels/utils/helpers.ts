import { createError } from 'h3'
import type { MailChannelsEmailRecipient, MailChannelsEmailOptions } from '../types/email'
import type { MailChannelsSetup } from '../index'

/**
 * Parses name-address pair string to MailChannels format
 */
export const parseRecipientString = (input: string) => {
  const trimmed = input.trim()
  const match = trimmed.match(/^([^<]*)<([^@\s]+@[^>\s]+)>$/)
  if (match) {
    const [, name, email] = match
    return { name: name.trim(), email: email.trim() }
  }
  return { email: trimmed }
}

/**
 * Parses any recipient format to MailChannels format
 */
export const parseRecipient = (recipient?: Partial<MailChannelsEmailRecipient> | string) => {
  if (typeof recipient === 'string') {
    return parseRecipientString(recipient)
  }

  if (recipient?.email) {
    return { email: recipient.email, name: recipient.name || undefined }
  }
}

/**
 * Parses any array of recipients format to MailChannels format
 */
export const parseArrayRecipients = (recipients?: Partial<MailChannelsEmailRecipient> | MailChannelsEmailRecipient[] | string[] | string) => {
  if (!recipients) return

  if (typeof recipients === 'string') {
    return [parseRecipientString(recipients)]
  }

  if (Array.isArray(recipients)) {
    return recipients.map(recipient => parseRecipient(recipient)!)
  }

  return [recipients as MailChannelsEmailRecipient]
}

/**
 * Overrides recipient with source if provided
 */
const overrideRecipient = (
  target: Partial<MailChannelsEmailRecipient> | string | undefined,
  source?: MailChannelsEmailRecipient | string,
) => {
  const parsedTarget = parseRecipient(target)
  const parsedSource = parseRecipient(source)

  return {
    email: parsedSource?.email || parsedTarget?.email,
    name: parsedSource?.name || parsedTarget?.name,
  }
}

/**
 * Overrides array of recipients with source if provided
 */
const overrideArrayRecipients = (
  target: Partial<MailChannelsEmailRecipient> | MailChannelsEmailRecipient[] | string | string[] | undefined,
  source?: MailChannelsEmailRecipient[] | MailChannelsEmailRecipient | string | string[],
) => {
  const parsedTarget = parseArrayRecipients(target)
  const parsedSource = parseArrayRecipients(source)

  const overridedArray = parsedSource ? parsedSource : parsedTarget
  const overrided = overridedArray?.filter(recipient => recipient.email).map(recipient => ({
    email: recipient.email,
    name: recipient.name || undefined,
  }))
  console.log(overrided)
  return overrided?.length ? overrided : undefined
}

/**
 * Gets config overrides
 */
export const getOverrides = (
  config: MailChannelsSetup['config'],
  sources: Pick<MailChannelsEmailOptions, 'from' | 'to' | 'cc' | 'bcc'>,
) => {
  const from = overrideRecipient(config.from, sources.from)
  if (!from.email) {
    throw createError({
      statusCode: 500,
      message: 'No MailChannels sender provided. Use the `from` option to specify a sender',
    })
  }

  const to = overrideArrayRecipients(config.to, sources.to)
  if (!to?.length) {
    throw createError({
      statusCode: 500,
      message: 'No MailChannels recipients provided. Use the `to` option to specify at least one recipient',
    })
  }

  const cc = overrideArrayRecipients(config.cc, sources.cc)
  const bcc = overrideArrayRecipients(config.bcc, sources.bcc)

  return {
    cc,
    bcc,
    from: { email: from.email ?? '', name: from.name },
    to,
  }
}
