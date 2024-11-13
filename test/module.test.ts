import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

await setup({ rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)) })

describe('ssr', () => {
  it('renders the index page', async () => {
    const html = await $fetch('/')
    expect(html).toContain('<div>Nuxt MailChannels</div>')
  })
})
