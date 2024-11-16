import { ModuleLogger } from './utils/logger'
import { normalizeRecipient, getOverrides } from './utils/helpers'
import type { MailChannelsEmailOptions, MailChannelsEmailPayload } from './types/email'
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

    const { from, to, cc, bcc } = getOverrides(this._setup.config, options)

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
      reply_to: normalizeRecipient(options.replyTo),
      from,
      subject: options.subject,
      content: [{
        type: 'text/html',
        value: options.html,
        template_type: options.mustaches ? 'mustache' : undefined,
      }],
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
