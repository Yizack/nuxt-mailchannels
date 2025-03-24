import { vi } from 'vitest'
import type { FetchRequest, FetchOptions } from 'ofetch'
import type { EmailsSendResponse } from '@yizack/mailchannels'

const mockedImplementation = (url: FetchRequest, options: FetchOptions<'json'>) => new Promise((resolve, reject) => {
  const { method, query, body } = options
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload = body as any
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

  if (!payload || !payload.content[0].value) {
    response.status = 400
    response.ok = false
    onResponse({ response })
    reject()
  }

  if (query && query['dry-run']) {
    response.status = 200
    let dryRunResponse = 'dry-run response'
    if (payload.personalizations[0].dynamic_template_data) {
      const entries = Object.entries(payload.personalizations[0].dynamic_template_data)
      for (const [key, value] of entries) {
        dryRunResponse = dryRunResponse + ` {{ ${key} }}`
        dryRunResponse = dryRunResponse.replace(`{{ ${key} }}`, value as string)
      }
    }
    data = [dryRunResponse]
  }

  onResponse({ response })
  resolve({ data })
})

export const mockSendAPI = () => {
  vi.mock(import('@yizack/mailchannels'), async (importOriginal) => {
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
