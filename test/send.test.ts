import { describe, it, expect, vi } from 'vitest'
import { mockSendAPI } from './mocks/send'
import { useMailChannels } from '../src/runtime/server/composables/mailchannels'
import nuxtConfig from './fixtures/full/nuxt.config'

const fake = {
  bcc: { email: 'bcc_override@example.com', name: 'BCC Override' },
  cc: { email: 'cc_override@example.com', name: 'CC Override' },
  from: { email: 'from_override@example.com', name: 'From Override' },
  to: {
    object: {
      email: 'to_override@example.com',
      name: 'To Override',
    },
    string: 'to_override@example.com',
    pairString: 'To Override <to_override@example.com>',
  },
  replyTo: { email: 'replyTo@example.com', name: 'ReplyTo Test' },
  subject: 'Test',
  html: '<p>Hello World</p>',
  mustaches: {
    html: '<p>Hello {{ world }}</p>',
    data: {
      world: 'World',
    },
  },
  dkim: {
    domain: 'example.com',
    privateKey: 'private_key',
    selector: 'selector',
  },
}

describe('useMailChannels send', async () => {
  vi.mock('#imports', () => ({
    useRuntimeConfig: vi.fn(() => ({
      mailchannels: {
        ...nuxtConfig.runtimeConfig?.mailchannels,
        ...nuxtConfig.mailchannels,
      },
    })),
  }))

  mockSendAPI()
  const mailchannels = useMailChannels()

  it('object recipients', async () => {
    const { success, data, error } = await mailchannels.send({
      to: fake.to.object,
      subject: fake.subject,
      html: fake.html,
    })
    expect(success).toBe(true)
    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('array recipients', async () => {
    const { success, data, error } = await mailchannels.send({
      to: [fake.to.object, fake.to.object],
      subject: fake.subject,
      html: fake.html,
    })
    expect(success).toBe(true)
    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('string recipients', async () => {
    const { success, data, error } = await mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      html: fake.html,
    })
    expect(success).toBe(true)
    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('dry run', async () => {
    const { success, data, error } = await mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      html: fake.html,
    }, true)
    expect(success).toBe(true)
    expect(data?.rendered).toStrictEqual(['dry-run response'])
    expect(error).toBeNull()
  })

  it('mustaches data', async () => {
    const { success, data, error } = await mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      html: fake.mustaches.html,
      mustaches: fake.mustaches.data,
    }, true)
    expect(success).toBe(true)
    expect(data!.rendered).toStrictEqual(['dry-run response ' + fake.mustaches.data.world])
    expect(error).toBeNull()
  })

  it('name-address pair string', async () => {
    const { success, data, error } = await mailchannels.send({
      to: fake.to.pairString,
      subject: fake.subject,
      html: fake.html,
    })
    expect(success).toBe(true)
    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('replyTo', async () => {
    const { success, data, error } = await mailchannels.send({
      to: fake.to.string,
      replyTo: fake.replyTo,
      subject: fake.subject,
      html: fake.html,
    })
    expect(success).toBe(true)
    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('empty html error', async () => {
    const { success, data, error } = await mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      html: '',
    })
    expect(success).toBe(false)
    expect(data).toBeNull()
    expect(error?.message).toBe('No email content provided')
  })

  it('empty text error', async () => {
    const { success, data, error } = await mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      text: '',
    })
    expect(success).toBe(false)
    expect(data).toBeNull()
    expect(error?.message).toBe('No email content provided')
  })

  it ('default bcc', async () => {
    const { success, data, error } = await mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      html: fake.html,
    })
    expect(success).toBe(true)
    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('default cc', async () => {
    const { success, data, error } = await mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      html: fake.html,
    })
    expect(success).toBe(true)
    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('default from', async () => {
    const { success, data, error } = await mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      html: fake.html,
    })
    expect(success).toBe(true)
    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('default to', async () => {
    const { success, data, error } = await mailchannels.send({
      subject: fake.subject,
      html: fake.html,
    })
    expect(success).toBe(true)
    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('overrides bcc', async () => {
    const { success, data, error } = await mailchannels.send({
      bcc: fake.bcc,
      to: fake.to.string,
      subject: fake.subject,
      html: fake.html,
    })
    expect(success).toBe(true)
    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('overrides cc', async () => {
    const { success, data, error } = await mailchannels.send({
      cc: fake.cc,
      to: fake.to.string,
      subject: fake.subject,
      html: fake.html,
    })
    expect(success).toBe(true)
    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('overrides from', async () => {
    const { success, data, error } = await mailchannels.send({
      to: fake.to.string,
      from: fake.from,
      subject: fake.subject,
      html: fake.html,
    })
    expect(success).toBe(true)
    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('overrides to', async () => {
    const { success, data, error } = await mailchannels.send({
      to: fake.to.object,
      subject: fake.subject,
      html: fake.html,
    })
    expect(success).toBe(true)
    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('sends email when bcc is empty', async () => {
    const { success, data, error } = await mailchannels.send({
      to: fake.to.object,
      bcc: { name: '', email: '' }, // this happen when not setting any bcc
      subject: fake.subject,
      html: fake.html,
    })
    expect(success).toBe(true)
    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('sends email when cc is empty', async () => {
    const { success, data, error } = await mailchannels.send({
      to: fake.to.object,
      cc: { name: '', email: '' }, // this happen when not setting any cc
      subject: fake.subject,
      html: fake.html,
    })
    expect(success).toBe(true)
    expect(data).toBeDefined()
    expect(error).toBeNull()
  })
})
