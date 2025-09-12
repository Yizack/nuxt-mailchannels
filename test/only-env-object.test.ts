import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { writeFile, readFile } from 'node:fs/promises'

const cloneEnvTest = async (fixture: string) => {
  const fixturePath = fileURLToPath(new URL(`./fixtures/${fixture}`, import.meta.url))
  await writeFile(path.join(fixturePath, '.env'), await readFile(path.join(fixturePath, '.env.test')))
}

describe('module config: only-env-object', async () => {
  await setup({ rootDir: fileURLToPath(new URL('./fixtures/only-env-object', import.meta.url)) })
  await cloneEnvTest('only-env-object')

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
