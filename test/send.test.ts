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
    const { data, error } = await mailchannels.send({
      to: fake.to.object,
      subject: fake.subject,
      html: fake.html,
    })

    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('array recipients', async () => {
    const { data, error } = await mailchannels.send({
      to: [fake.to.object, fake.to.object],
      subject: fake.subject,
      html: fake.html,
    })

    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('string recipients', async () => {
    const { data, error } = await mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      html: fake.html,
    })

    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('dry run', async () => {
    const { data, error } = await mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      html: fake.html,
    }, true)

    expect(data?.rendered).toStrictEqual(['dry-run response'])
    expect(error).toBeNull()
  })

  it('mustaches data', async () => {
    const { data, error } = await mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      html: fake.mustaches.html,
      template: {
        type: 'mustache',
        data: fake.mustaches.data,
      },
    }, true)

    expect(data!.rendered).toStrictEqual(['dry-run response ' + fake.mustaches.data.world])
    expect(error).toBeNull()
  })

  it('name-address pair string', async () => {
    const { data, error } = await mailchannels.send({
      to: fake.to.pairString,
      subject: fake.subject,
      html: fake.html,
    })

    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('replyTo', async () => {
    const { data, error } = await mailchannels.send({
      to: fake.to.string,
      replyTo: fake.replyTo,
      subject: fake.subject,
      html: fake.html,
    })

    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('empty html error', async () => {
    const { data, error } = await mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      html: '',
    })

    expect(data).toBeNull()
    expect(error?.message).toBe('No email content provided')
  })

  it('empty text error', async () => {
    const { data, error } = await mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      text: '',
    })

    expect(data).toBeNull()
    expect(error?.message).toBe('No email content provided')
  })

  it ('default bcc', async () => {
    const { data, error } = await mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      html: fake.html,
    })

    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('default cc', async () => {
    const { data, error } = await mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      html: fake.html,
    })

    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('default from', async () => {
    const { data, error } = await mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      html: fake.html,
    })

    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('default to', async () => {
    const { data, error } = await mailchannels.send({
      subject: fake.subject,
      html: fake.html,
    })

    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('overrides bcc', async () => {
    const { data, error } = await mailchannels.send({
      bcc: fake.bcc,
      to: fake.to.string,
      subject: fake.subject,
      html: fake.html,
    })

    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('overrides cc', async () => {
    const { data, error } = await mailchannels.send({
      cc: fake.cc,
      to: fake.to.string,
      subject: fake.subject,
      html: fake.html,
    })

    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('overrides from', async () => {
    const { data, error } = await mailchannels.send({
      to: fake.to.string,
      from: fake.from,
      subject: fake.subject,
      html: fake.html,
    })

    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('overrides to', async () => {
    const { data, error } = await mailchannels.send({
      to: fake.to.object,
      subject: fake.subject,
      html: fake.html,
    })

    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('sends email when bcc is empty', async () => {
    const { data, error } = await mailchannels.send({
      to: fake.to.object,
      bcc: { name: '', email: '' }, // this happen when not setting any bcc
      subject: fake.subject,
      html: fake.html,
    })

    expect(data).toBeDefined()
    expect(error).toBeNull()
  })

  it('sends email when cc is empty', async () => {
    const { data, error } = await mailchannels.send({
      to: fake.to.object,
      cc: { name: '', email: '' }, // this happen when not setting any cc
      subject: fake.subject,
      html: fake.html,
    })

    expect(data).toBeDefined()
    expect(error).toBeNull()
  })
})
