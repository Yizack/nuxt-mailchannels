import { vi } from 'vitest'
import type { FetchRequest, FetchOptions } from 'ofetch'
import type { SendPayload } from '@yizack/mailchannels'

const mockedImplementation = (url: FetchRequest, options: FetchOptions<'json'>) => new Promise((resolve, reject) => {
  const { method, query, onResponse, onResponseError } = options
  const payload = options.body as SendPayload
  const path = `/tx/v1/send`

  const response = {
    status: 202,
    statusText: 'Success',
    data: undefined as string[] | undefined | null,
  }

  let isError = false

  if (method !== 'POST' || url !== path) {
    response.status = 401
    response.statusText = 'Authorization Required'
    isError = true
  }

  if (!payload || !payload.content[0].value) {
    response.status = 400
    response.statusText = 'Bad Request'
    isError = true
  }

  if (isError) {
    if (typeof onResponseError === 'function') {
      onResponseError({ response } as never)
    }
    return reject(void 0)
  }

  if (query && query['dry-run']) {
    response.status = 200
    response.statusText = 'OK'
    let dryRunResponse = 'dry-run response'
    if (payload.personalizations[0].dynamic_template_data) {
      const entries = Object.entries(payload.personalizations[0].dynamic_template_data)
      for (const [key, value] of entries) {
        dryRunResponse = dryRunResponse + ` {{ ${key} }}`
        dryRunResponse = dryRunResponse.replace(`{{ ${key} }}`, value as string)
      }
    }
    response.data = [dryRunResponse]
  }

  if (typeof onResponse === 'function') {
    onResponse({ response } as never)
  }

  return response.status === 202 ? resolve(null) : resolve({ data: response.data })
})

export const mockSendAPI = () => {
  vi.mock(import('@yizack/mailchannels'), async (importOriginal) => {
    const original = await importOriginal()
    // Override the internal _fetch method
    const originalMailChannels = original.MailChannels
    const mockedMailchannels = class extends originalMailChannels {
      protected override async _fetch<T>(path: string, options: FetchOptions<'json'>): Promise<T> {
        return mockedImplementation(path, options) as unknown as T
      }
    }

    return {
      ...original,
      MailChannels: mockedMailchannels,
    }
  })
}
