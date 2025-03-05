import { createError } from 'h3'
import type { RuntimeConfig } from '@nuxt/schema'
import type { NuxtMailChannelsOptions } from '../../types'
import { Email } from './email'

export interface MailChannelsSetup {
  headers: Record<string, string>
  baseURL: string
  config: RuntimeConfig['mailchannels'] & NuxtMailChannelsOptions
}

export class MailChannels {
  #setup: MailChannelsSetup

  constructor(config: MailChannelsSetup['config']) {
    if (!config.apiKey) {
      throw createError({
        statusCode: 500,
        message: 'Missing MailChannels API key',
      })
    }

    this.#setup = {
      baseURL: 'https://api.mailchannels.net',
      headers: {
        'X-API-Key': config.apiKey,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      config,
    }
  }

  get send(): Email['send'] {
    const email = new Email(this.#setup)
    return email.send.bind(email)
  }
}
