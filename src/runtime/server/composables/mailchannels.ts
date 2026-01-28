import { MailChannelsClient, Emails, type EmailsSendOptions } from 'mailchannels-sdk'
import { createError, type H3Event } from 'h3'
import { overrideRecipient } from '../utils/helpers'
import { useRuntimeConfig } from '#imports'
import defu from 'defu'

interface EmailsSendOptionsWithOverrides extends Omit<EmailsSendOptions, 'to' | 'from'> {
  to?: EmailsSendOptions['to']
  from?: EmailsSendOptions['from']
}

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

  const getOverrides = (options: EmailsSendOptionsWithOverrides) => (<EmailsSendOptions>{
    ...options,
    to: overrideRecipient(config.to, options.to),
    from: overrideRecipient(config.from, options.from),
    cc: overrideRecipient(config.cc, options.cc),
    bcc: overrideRecipient(config.bcc, options.bcc),
    dkim: defu(options.dkim, config.dkim),
  })

  /**
   * Send an email using MailChannels Email API
   * @param options - The email options to send
   * @param dryRun - When set to `true`, the message will not be sent. Instead, the fully rendered message will be returned in the `data` property of the response. The default value is `false`.
   * @example
   * ```ts
   * // Inside an API route handler
   * export default defineEventHandler(async (event) => {
   *   const mailchannels = useMailChannels(event)
   *
   *   const { success, data, error } = await mailchannels.send({
   *     to: 'to@example.com',
   *     from: 'from@example.com',
   *     subject: 'Test',
   *     html: 'Test',
   *   })
   *
   *   return { success }
   * })
   * ```
   */
  const send = async (
    options: EmailsSendOptionsWithOverrides,
    dryRun?: boolean,
  ) => emails.send(getOverrides(options), dryRun)

  /**
   * Queues an email message for asynchronous processing and returns immediately with a request ID.
   *
   * The email will be processed in the background, and you'll receive webhook events for all delivery status updates (e.g. `dropped`, `processed`, `delivered`, `hard-bounced`). These webhook events are identical to those sent for the synchronous /send endpoint.
   *
   * Use this endpoint when you need to send emails without waiting for processing to complete. This can improve your application's response time, especially when sending to multiple recipients.
   * @param options - The email options to send.
   * @example
   * ```ts
   * // Inside an API route handler
   * export default defineEventHandler(async (event) => {
   *   const mailchannels = useMailChannels(event)
   *
   *   const { data, error } = await mailchannels.sendAsync({
   *     to: 'to@example.com',
   *     from: 'from@example.com',
   *     subject: 'Test',
   *     html: 'Test',
   *   })
   *
   *   return { data }
   * })
   * ```
   */
  const sendAsync = async (
    options: EmailsSendOptionsWithOverrides,
  ) => emails.sendAsync(getOverrides(options))

  return { send, sendAsync }
}
