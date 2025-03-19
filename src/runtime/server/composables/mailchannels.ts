import { MailChannelsClient } from '@yizack/mailchannels'
import { Emails, type EmailsSendOptions } from '@yizack/mailchannels/modules'
import { createError, type H3Event } from 'h3'
import { overrideRecipient } from '../utils/helpers'
import { useRuntimeConfig } from '#imports'

export const useMailChannels = (event?: H3Event) => {
  const config = useRuntimeConfig(event).mailchannels

  if (!config.apiKey) {
    throw createError({
      statusCode: 500,
      message: 'Missing MailChannels API key',
    })
  }

  const mailchannels = new MailChannelsClient(config.apiKey)
  const emails = new Emails(mailchannels)

  /**
   * Send an email using MailChannels Email API
   * @param options - The email options to send
   * @param dryRun - When set to `true`, the message will not be sent. Instead, the fully rendered message will be returned in the `data` property of the response. The default value is `false`.
   * @example
   * ```ts
   * // Inside an API route handler
   * export default defineEventHandler(async (event) => {
   *   const mailchannels = useMailChannels(event)
   *   const { success } = await mailchannels.send({
   *     to: 'to@example.com',
   *     from: 'from@example.com',
   *     subject: 'Test',
   *     html: 'Test',
   *   })
   *   return { success }
   * })
   * ```
   */
  const send = async (options: EmailsSendOptions, dryRun?: boolean) => {
    const overrides: EmailsSendOptions = {
      ...options,
      to: overrideRecipient(config.to, options.to),
      from: overrideRecipient(config.from, options.from),
      cc: overrideRecipient(config.cc, options.cc),
      bcc: overrideRecipient(config.bcc, options.bcc),
      dkim: config.dkim,
    }

    const response = await emails.send(overrides, dryRun).catch((error: Error) => {
      throw createError({
        statusCode: 500,
        message: error.message,
      })
    })

    return response
  }

  return { send }
}
