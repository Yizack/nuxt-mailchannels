import { MailChannelsClient, Emails, type EmailsSendOptions } from 'mailchannels-sdk'
import { createError, type H3Event } from 'h3'
import { overrideRecipient } from '../utils/helpers'
import { useRuntimeConfig } from '#imports'
import defu from 'defu'

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
  const send = async (
    options: Omit<EmailsSendOptions, 'to' | 'from'> & Partial<{
      to: EmailsSendOptions['to']
      from: EmailsSendOptions['from']
    }>,
    dryRun?: boolean,
  ) => {
    const overrides: EmailsSendOptions = {
      ...options,
      // @ts-expect-error optional since can receive a default value and package will handle the error
      to: overrideRecipient(config.to, options.to),
      // @ts-expect-error optional since can receive a default value and package will handle the error
      from: overrideRecipient(config.from, options.from),
      cc: overrideRecipient(config.cc, options.cc),
      bcc: overrideRecipient(config.bcc, options.bcc),
      dkim: defu(options.dkim, config.dkim),
    }

    const { success, data, error } = await emails.send(overrides, dryRun).catch((error: Error) => {
      throw createError({
        statusCode: 500,
        message: error.message,
      })
    })

    if (!success && error) {
      throw createError({
        statusCode: error.statusCode ?? 500,
        message: error.message,
      })
    }

    return { success, data }
  }

  return { send }
}
