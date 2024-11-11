import type { MailChannels } from './mailchannels'
import { normalizeRecipients } from './helpers'
import type { MailChannelsEmailOptions, MailChannelsEmailSend } from './types/emails'

export class Emails {
  constructor(private readonly mailchannels: MailChannels) {}

  /**
   * Send an email using MailChannels Email API
   * @param payload - The email payload
   * @param dryRun - When set to true, the message will not be sent. Instead, the fully rendered message will be printed to the console. This can be useful for testing. Defaults to `false`.
   * @returns Promise<boolean>
   * @example
   * ```ts
   * // Inside an API route handler
   * export default defineEventHandler(async (event) => {
   *   const mailchannels = useMailChannels(event)
   *   await mailchannels.emails.send({
   *     to: 'to@example.com',
   *     from: 'from@example.com',
   *     subject: 'Test',
   *     html: 'Test',
   *   })
   *   return { response }
   * })
   * ```
   */
  async send(payload: MailChannelsEmailOptions, dryRun = false) {
    const body = JSON.stringify({
      attachments: payload.attachments,
      personalizations: [{
        bcc: payload.bcc ? normalizeRecipients(payload.bcc) : undefined,
        cc: payload.cc ? normalizeRecipients(payload.cc) : undefined,
        to: normalizeRecipients(payload.to),
        dkim_domain: this.mailchannels['config'].dkim.domain || undefined,
        dkim_private_key: this.mailchannels['config'].dkim.privateKey || undefined,
        dkim_selector: this.mailchannels['config'].dkim.selector || undefined,
        dynamic_template_data: payload.mustaches,
      }],
      from: typeof payload.from === 'string' ? { email: payload.from } : payload.from,
      subject: payload.subject,
      content: [{
        type: 'text/html',
        value: payload.html,
      }],
    } satisfies MailChannelsEmailSend)

    return $fetch('/tx/v1/send', {
      baseURL: this.mailchannels['baseUrl'],
      headers: this.mailchannels['headers'],
      method: 'POST',
      query: { 'dry-run': dryRun },
      body,
      onResponse: async ({ response }) => {
        if (response.status === 200) {
          console.info(`[MailChannels] [${response.status}] Send:`, response.statusText)
          const formattedData = response._data.data.map((item: string) => item.split('\r\n').map(line => line.trim()).join('\n'))
          formattedData.forEach((item: string) => console.info(`[MailChannels] [response]`, item))
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
    }).then(() => true).catch(() => false)
  }
}
