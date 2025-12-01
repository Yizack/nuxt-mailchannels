import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('module config: runtimeconfig-defaults', async () => {
  await setup({ rootDir: fileURLToPath(new URL('./fixtures/runtimeconfig-defaults', import.meta.url)) })

  it('should load config from environment variables only', async () => {
    const config = await $fetch('/api/config')

    expect(config).toEqual({
      apiKey: 'test_api_key',
      dkim: {
        domain: 'test_dkim_domain',
        privateKey: 'test_dkim_private_key',
        selector: 'test_dkim_selector',
      },
      bcc: { email: 'bcc@example.com', name: 'BCC Name' },
      cc: { email: 'cc@example.com', name: 'CC Name' },
      from: { email: 'from@example.com', name: 'From Name' },
      to: { email: 'to@example.com', name: 'To Name' },
    })
  })
})
