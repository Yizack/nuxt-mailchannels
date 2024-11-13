import { vi } from 'vitest'
import type { FetchRequest, FetchOptions, ResponseType } from 'ofetch'
import type { MailChannelsEmailBody } from '../src/runtime/mailchannels/types/email'

export const stubSendAPI = () => {
  vi.stubGlobal('$fetch', (url: FetchRequest, options: FetchOptions<Partial<ResponseType>, 'json'>) => new Promise((resolve, reject) => {
    const { baseURL, method, headers, query, onResponse, onResponseError } = options
    const body = options.body as MailChannelsEmailBody

    const apiKey = (headers as Record<string, string>)?.['X-API-Key']

    const apiURL = 'https://api.mailchannels.net'
    const sendPath = `/tx/v1/send`

    const response = {
      status: 202,
      statusText: 'Success',
      data: undefined as string[] | undefined,
    }

    let isError = false

    if (method !== 'POST' || !apiKey || apiURL !== baseURL || url !== sendPath) {
      response.status = 401
      response.statusText = 'Authorization Required'
      isError = true
    }

    if (!body) {
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
      if (body.personalizations[0].dynamic_template_data) {
        const entries = Object.entries(body.personalizations[0].dynamic_template_data)
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

    return resolve({
      data: response.data,
    })
  }))
}
