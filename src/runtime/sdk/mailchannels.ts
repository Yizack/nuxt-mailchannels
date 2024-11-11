import type { RuntimeConfig } from '@nuxt/schema'
import { Emails } from './emails'

export class MailChannels {
  protected readonly headers: Record<string, string>
  protected readonly baseUrl = 'https://api.mailchannels.net'
  readonly emails = new Emails(this)

  constructor(protected readonly config: RuntimeConfig['mailchannels']) {
    if (!this.config.apiKey) throw new Error('Missing MailChannels API key.')

    this.headers = {
      'X-API-Key': this.config.apiKey,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  }
}
