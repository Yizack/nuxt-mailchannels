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
      response.data = ['dry-run response']
    }

    if (typeof onResponse === 'function') {
      onResponse({ response } as never)
    }

    return resolve({
      data: response.data,
    })
  }))
}
