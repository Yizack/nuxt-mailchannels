import type { RuntimeConfig } from '@nuxt/schema'
import { Email } from './email'

export class MailChannels {
  protected readonly headers: Record<string, string>
  protected readonly baseUrl = 'https://api.mailchannels.net'

  private readonly emailAPI = new Email(this)
  readonly send = this.emailAPI.send.bind(this.emailAPI)

  constructor(protected readonly config: RuntimeConfig['mailchannels']) {
    if (!this.config.apiKey) throw new Error('Missing MailChannels API key.')

    this.headers = {
      'X-API-Key': this.config.apiKey,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  }
}
