import { vi } from 'vitest'
import type { FetchRequest, FetchOptions } from 'ofetch'
import type { EmailsSendResponse, EmailsSendRecipient } from 'mailchannels-sdk'

// https://github.com/Yizack/mailchannels/blob/main/src/types/emails/internal.d.ts#L24
interface EmailsSendPayload {
  content: {
    template_type?: 'mustache'
    type: 'text/html' | 'text/plain'
    value: string
  }[]
  personalizations: {
    bcc?: EmailsSendRecipient[]
    cc?: EmailsSendRecipient[]
    from?: EmailsSendRecipient
    to: EmailsSendRecipient[]
    dynamic_template_data?: Record<string, unknown>
  }[]
}

const mockedImplementation = (url: FetchRequest, options: FetchOptions<'json'>) => new Promise((resolve, reject) => {
  const { method, query, body } = options

  const payload = body as EmailsSendPayload
  const path = `/tx/v1/send`
  const onResponse = options.onResponse as unknown as (hook: { response: { status: number, ok: boolean } }) => void

  let data: EmailsSendResponse['data'] = undefined
  const response = { status: 202, ok: true }

  if (method !== 'POST' || url !== path) {
    response.status = 404
    response.ok = false
    onResponse({ response })
    reject()
  }

  if (!payload || !payload.content[0]?.value) {
    response.status = 400
    response.ok = false
    onResponse({ response })
    reject()
  }

  if (query && query['dry-run']) {
    response.status = 200
    let dryRunResponse = 'dry-run response'
    if (payload.personalizations[0]?.dynamic_template_data) {
      const entries = Object.entries(payload.personalizations[0]?.dynamic_template_data)
      for (const [key, value] of entries) {
        dryRunResponse = dryRunResponse + ` {{ ${key} }}`
        dryRunResponse = dryRunResponse.replace(`{{ ${key} }}`, value as string)
      }
    }
    data = [dryRunResponse]
  }

  const ensureValidRecipient = <T>(recipient?: NonNullable<T>) => {
    if (typeof recipient === 'object') {
      if (Array.isArray(recipient)) {
        for (const r of recipient) {
          ensureValidRecipient(r)
        }
      }
      else if (
        'name' in recipient
        && 'email' in recipient
        && !recipient.name
        && !recipient.email
      ) {
        response.ok = false
        response.status = 400
        onResponse({ response })
        reject()
      }
    }
  }

  ensureValidRecipient(payload.personalizations[0]?.from)
  ensureValidRecipient(payload.personalizations[0]?.to)
  ensureValidRecipient(payload.personalizations[0]?.cc)
  ensureValidRecipient(payload.personalizations[0]?.bcc)

  onResponse({ response })
  resolve({ data })
})

export const mockSendAPI = () => {
  vi.mock(import('mailchannels-sdk'), async (importOriginal) => {
    const original = await importOriginal()
    // Override the internal _fetch method
    const mockedMailchannels = class extends original.MailChannelsClient {
      protected override async _fetch<T>(path: string, options: FetchOptions<'json'>): Promise<T> {
        return mockedImplementation(path, options) as unknown as T
      }
    }

    return {
      MailChannelsClient: mockedMailchannels,
    }
  })
}
