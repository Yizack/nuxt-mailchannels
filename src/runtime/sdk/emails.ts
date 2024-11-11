import type { MailChannels } from './mailchannels'
import { normalizeRecipients } from './helpers'
import type { MailChannelsEmailOptions, MailChannelsEmailSend } from './types/emails'

export class Emails {
  constructor(private readonly mailchannels: MailChannels) {}

  async send(payload: MailChannelsEmailOptions, dry = false) {
    const output = {
      data: null as string[] | null,
      error: null as string | null,
    }

    const body = JSON.stringify({
      attachments: payload.attachments,
      personalizations: [{
        bcc: payload.bcc ? normalizeRecipients(payload.bcc) : undefined,
        cc: payload.cc ? normalizeRecipients(payload.cc) : undefined,
        to: normalizeRecipients(payload.to),
        dkim_domain: this.mailchannels.config.dkim.domain || undefined,
        dkim_private_key: this.mailchannels.config.dkim.privateKey || undefined,
        dkim_selector: this.mailchannels.config.dkim.selector || undefined,
        dynamic_template_data: payload.mustaches,
      }],
      from: typeof payload.from === 'string' ? { email: payload.from } : payload.from,
      subject: payload.subject,
      content: [{
        type: 'text/html',
        value: payload.html,
      }],
    } satisfies MailChannelsEmailSend)

    const response = await $fetch<{ data: string[] }>(`${this.mailchannels.baseUrl}/tx/v1/send`, {
      method: 'POST',
      headers: this.mailchannels.headers,
      query: { 'dry-run': dry },
      body,
      onResponseError: async ({ response }) => {
        if (response.status !== 500) {
          output.error = output.error = response._data.message
          return
        }
        const body = await response.json() as { errors: string[] }
        if (body && Array.isArray(body.errors)) {
          output.error = body.errors.join(', ')
        }
      },
    }).catch(() => null)

    output.data = response?.data || null
    return output
  }
}
