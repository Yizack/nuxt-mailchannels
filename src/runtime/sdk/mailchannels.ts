import type { RuntimeConfig } from '@nuxt/schema'
import { Emails } from './emails'

export class MailChannels {
  readonly baseUrl = 'https://api.mailchannels.net'
  readonly emails = new Emails(this)
  readonly headers: Record<string, string>

  constructor(readonly config: RuntimeConfig['mailchannels']) {
    if (!this.config.apiKey) throw new Error('Missing MailChannels API key.')

    this.headers = {
      'X-API-Key': this.config.apiKey,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  }
}
