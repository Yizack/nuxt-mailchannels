import { vi } from 'vitest'
import type { FetchRequest, FetchOptions } from 'ofetch'

const mockedImplementation = (url: FetchRequest, options: FetchOptions<'json'>) => new Promise((resolve, reject) => {
  const { method, query, body } = options
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload = body as any
  const path = `/tx/v1/send`

  const response = {
    status: 202,
    data: undefined as string[] | undefined | null,
  }

  let isError = false

  if (method !== 'POST' || url !== path) {
    response.status = 401
    isError = true
  }

  if (!payload || !payload.content[0].value) {
    response.status = 400
    isError = true
  }

  if (isError) {
    return reject(void 0)
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
    response.data = [dryRunResponse]
  }

  return response.status === 202 ? resolve(null) : resolve({ data: response.data })
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
