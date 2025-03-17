import { MailChannels, type SendOptions } from '@yizack/mailchannels'
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

  const mailchannels = new MailChannels(config.apiKey)

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
  const send = async (options: SendOptions, dryRun?: boolean) => {
    const overrides: SendOptions = {
      ...options,
      to: overrideRecipient(config.to, options.to),
      from: overrideRecipient(config.from, options.from),
      cc: overrideRecipient(config.cc, options.cc),
      bcc: overrideRecipient(config.bcc, options.bcc),
      dkim: config.dkim,
    }

    const response = await mailchannels.emails.send(overrides, dryRun).catch((error: Error) => {
      throw createError({
        statusCode: 500,
        message: error.message,
      })
    })

    // DKIM data is stripped in production to prevent leaks
    if (!import.meta.dev && config.dkim) {
      delete response.payload.personalizations[0].dkim_domain
      delete response.payload.personalizations[0].dkim_private_key
      delete response.payload.personalizations[0].dkim_selector
    }

    return response
  }

  return { send }
}
