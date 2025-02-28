import { createError } from 'h3'
import { ModuleLogger } from './utils/logger'
import { parseRecipient, getOverrides } from './utils/helpers'
import type { MailChannelsEmailOptions, MailChannelsEmailPayload, MailChannelsEmailContent } from './types/email'
import type { MailChannelsSetup } from './index'

export class Email {
  private readonly name = 'Email'

  constructor(private readonly _setup: MailChannelsSetup) {}

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
  async send(options: MailChannelsEmailOptions, dryRun = false) {
    const logger = new ModuleLogger(this.name, 'send')

    const { html, text, mustaches } = options
    const { cc, bcc, from, to } = getOverrides(this._setup.config, options)

    const content: MailChannelsEmailContent[] = []
    const template_type = mustaches ? 'mustache' : undefined

    // Plain text must come first if provided
    if (text) content.push({ type: 'text/plain', value: text, template_type })
    if (html) content.push({ type: 'text/html', value: html, template_type })
    if (!content.length) {
      throw createError({
        statusCode: 500,
        message: 'No email content provided.',
      })
    }

    const payload: MailChannelsEmailPayload = {
      attachments: options.attachments,
      personalizations: [{
        bcc,
        cc,
        to,
        dkim_domain: this._setup.config.dkim.domain || undefined,
        dkim_private_key: this._setup.config.dkim.privateKey || undefined,
        dkim_selector: this._setup.config.dkim.selector || undefined,
        dynamic_template_data: options.mustaches,
      }],
      reply_to: parseRecipient(options.replyTo),
      from,
      subject: options.subject,
      content,
    }

    let success = true

    const res = await $fetch<{ data: string[] }>('/tx/v1/send', {
      baseURL: this._setup.baseURL,
      headers: this._setup.headers,
      method: 'POST',
      query: { 'dry-run': dryRun },
      body: payload,
      onResponse: ({ response }) => {
        if (response.status === 200) {
          logger.info(response.status, response.statusText)
        }
      },
      onResponseError: async ({ response }) => {
        success = false
        if (response.status !== 500 && response.status !== 502) {
          logger.info(response.status, response.statusText)
          return
        }
        const body = await response.json() as { errors: string[] }
        if (body && Array.isArray(body.errors)) {
          logger.error(response.status, response.statusText, body.errors)
        }
      },
    }).catch(() => null)

    // Redact DKIM values in production to prevent leaks
    if (!import.meta.dev && this._setup.config.dkim) {
      payload.personalizations[0].dkim_domain = 'REDACTED'
      payload.personalizations[0].dkim_private_key = 'REDACTED'
      payload.personalizations[0].dkim_selector = 'REDACTED'
    }

    return {
      success,
      payload,
      data: res?.data,
    }
  }
}
