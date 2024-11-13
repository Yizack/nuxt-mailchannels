import { describe, it, expect, vi } from 'vitest'
import { useMailChannels } from '../src/runtime/server/utils/mailchannels'
import { stubSendAPI } from './stubs'
import nuxtConfig from './fixtures/basic/nuxt.config'

describe('useMailChannels send', () => {
  vi.mock('#imports', () => ({
    useRuntimeConfig: vi.fn(() => ({ mailchannels: nuxtConfig.runtimeConfig?.mailchannels })),
    useAppConfig: vi.fn(() => ({ mailchannels: nuxtConfig.mailchannels })),
  }))

  stubSendAPI()

  const fake = {
    to: {
      object: {
        email: 'to@example.com',
        name: 'To',
      },
      string: 'to@example.com',
    },
    from: {
      email: 'from@example.com',
      name: 'From',
    },
    subject: 'Test',
    html: '<p>Hello World</p>',
  }

  const mailchannels = useMailChannels()

  it('object recipients', async () => {
    const response = await mailchannels.send({
      to: fake.to.object,
      subject: fake.subject,
      html: fake.html,
    })
    expect(response).toBe(true)
  })

  it('array recipients', async () => {
    const response = await mailchannels.send({
      to: [fake.to.object, fake.to.object],
      subject: fake.subject,
      html: fake.html,
    })
    expect(response).toBe(true)
  })

  it('string recipients', async () => {
    const response = await mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      html: fake.html,
    })
    expect(response).toBe(true)
  })

  it('override from', async () => {
    const response = await mailchannels.send({
      to: fake.to.string,
      from: fake.from,
      subject: fake.subject,
      html: fake.html,
    })
    expect(response).toBe(true)
  })

  it('dr-run', async () => {
    const response = await mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      html: fake.html,
    }, true)
    expect(response).toBe(true)
  })
})
