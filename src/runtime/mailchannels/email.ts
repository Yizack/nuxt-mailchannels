import { normalizeRecipient, normalizeArrayRecipients, ensureToAndFrom } from './helpers'
import type { MailChannelsEmailOptions, MailChannelsEmailBody } from './types/email'
import type { MailChannels } from './index'

export class Email {
  constructor(private readonly mailchannels: MailChannels) {}

  /**
   * Send an email using MailChannels Email API
   * @param options - The email options to send
   * @param dryRun - When set to `true`, the message will not be sent. Instead, the fully rendered message will be returned in the `data` property of the response. The default value is `false`.
   * @returns Promise<boolean>
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
    const { from, to } = ensureToAndFrom(this.mailchannels, options.from, options.to)

    const body = {
      attachments: options.attachments,
      personalizations: [{
        bcc: normalizeArrayRecipients(options.bcc),
        cc: normalizeArrayRecipients(options.cc),
        to,
        dkim_domain: this.mailchannels['config'].dkim.domain || undefined,
        dkim_private_key: this.mailchannels['config'].dkim.privateKey || undefined,
        dkim_selector: this.mailchannels['config'].dkim.selector || undefined,
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
    } satisfies MailChannelsEmailBody

    const response = await $fetch<{ data: string[] }>('/tx/v1/send', {
      baseURL: this.mailchannels['baseURL'],
      headers: this.mailchannels['headers'],
      method: 'POST',
      query: { 'dry-run': dryRun },
      body,
      onResponse: ({ response }) => {
        if (response.status === 200) {
          console.info(`[MailChannels] [${response.status}] Send:`, response.statusText)
        }
      },
      onResponseError: async ({ response }) => {
        if (response.status !== 500 && response.status !== 502) {
          console.error(`[MailChannels] [${response.status}] Send:`, response.statusText)
          return
        }
        const body = await response.json() as { errors: string[] }
        if (body && Array.isArray(body.errors)) {
          console.error(`[MailChannels] [${response.status}] Send:`, response.statusText, body.errors.join(', '))
        }
      },
    }).catch(() => null)

    // Redact DKIM values in production to prevent leaks
    if (!import.meta.dev && this.mailchannels['config'].dkim) {
      body.personalizations[0].dkim_domain = 'REDACTED'
      body.personalizations[0].dkim_private_key = 'REDACTED'
      body.personalizations[0].dkim_selector = 'REDACTED'
    }

    return {
      success: response !== null,
      payload: body,
      data: response?.data,
    }
  }
}
