import { vi } from 'vitest'
import type { FetchRequest, FetchOptions, ResponseType } from 'ofetch'
import type { MailChannelsEmailPayload } from '../../src/runtime/mailchannels/types/email'

export const stubSendAPI = () => {
  vi.stubGlobal('$fetch', (url: FetchRequest, options: FetchOptions<Partial<ResponseType>, 'json'>) => new Promise((resolve, reject) => {
    const { baseURL, method, headers, query, onResponse, onResponseError } = options
    const payload = options.body as MailChannelsEmailPayload

    const apiKey = (headers as Record<string, string>)?.['X-API-Key']

    const apiURL = 'https://api.mailchannels.net'
    const sendPath = `/tx/v1/send`

    const response = {
      status: 202,
      statusText: 'Success',
      data: undefined as string[] | undefined | null,
    }

    let isError = false

    if (method !== 'POST' || !apiKey || apiURL !== baseURL || url !== sendPath) {
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

    return response.status === 202
      ? resolve(null)
      : resolve({
        data: response.data,
      })
  }))
}
