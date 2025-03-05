import { describe, it, expect, vi } from 'vitest'
import { useMailChannels } from '../src/runtime/server/utils/mailchannels'
import { stubSendAPI } from './stubs/send'
import nuxtConfig from './fixtures/basic/nuxt.config'

describe('useMailChannels send', () => {
  vi.mock('#imports', () => ({
    useRuntimeConfig: vi.fn(() => ({
      mailchannels: {
        ...nuxtConfig.runtimeConfig?.mailchannels,
        ...nuxtConfig.mailchannels,
      },
    })),
  }))

  stubSendAPI()

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
  }

  const mailchannels = useMailChannels()

  it('object recipients', async () => {
    const response = await mailchannels.send({
      to: fake.to.object,
      subject: fake.subject,
      html: fake.html,
    })
    expect(response.success).toBe(true)
    expect(response.payload.from).toStrictEqual(nuxtConfig.mailchannels?.from)
    expect(response.data).toBeUndefined()
  })

  it('array recipients', async () => {
    const response = await mailchannels.send({
      to: [fake.to.object, fake.to.object],
      subject: fake.subject,
      html: fake.html,
    })
    expect(response.success).toBe(true)
    expect(response.payload.from).toStrictEqual(nuxtConfig.mailchannels?.from)
    expect(response.data).toBeUndefined()
  })

  it('string recipients', async () => {
    const response = await mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      html: fake.html,
    })
    expect(response.success).toBe(true)
    expect(response.payload.from).toStrictEqual(nuxtConfig.mailchannels?.from)
    expect(response.data).toBeUndefined()
  })

  it('dry run', async () => {
    const response = await mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      html: fake.html,
    }, true)
    expect(response.success).toBe(true)
    expect(response.payload.from).toStrictEqual(nuxtConfig.mailchannels?.from)
    expect(response.data).toStrictEqual(['dry-run response'])
  })

  it('mustaches data', async () => {
    const response = await mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      html: fake.mustaches.html,
      mustaches: fake.mustaches.data,
    }, true)
    expect(response.success).toBe(true)
    expect(response.payload.from).toStrictEqual(nuxtConfig.mailchannels?.from)
    expect(response.data![0]).toContain(fake.mustaches.data.world)
  })

  it('name-address pair string', async () => {
    const response = await mailchannels.send({
      to: fake.to.pairString,
      subject: fake.subject,
      html: fake.html,
    })
    expect(response.success).toBe(true)
    expect(response.payload.personalizations[0].to).toStrictEqual([fake.to.object])
    expect(response.data).toBeUndefined()
  })

  it('replyTo', async () => {
    const response = await mailchannels.send({
      to: fake.to.string,
      replyTo: fake.replyTo,
      subject: fake.subject,
      html: fake.html,
    })
    expect(response.success).toBe(true)
    expect(response.payload.reply_to).toStrictEqual(fake.replyTo)
    expect(response.data).toBeUndefined()
  })

  it('empty html error', async () => {
    const response = mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      html: '',
    })
    await expect(response).rejects.toThrowError('No email content provided')
  })

  it('empty text error', async () => {
    const response = mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      text: '',
    })
    await expect(response).rejects.toThrowError('No email content provided')
  })

  it ('default bcc', async () => {
    const response = await mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      html: fake.html,
    })
    expect(response.success).toBe(true)
    expect(response.payload.personalizations[0].bcc).toStrictEqual([nuxtConfig.mailchannels?.bcc])
    expect(response.data).toBeUndefined()
  })

  it('default cc', async () => {
    const response = await mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      html: fake.html,
    })
    expect(response.success).toBe(true)
    expect(response.payload.personalizations[0].cc).toStrictEqual([nuxtConfig.mailchannels?.cc])
    expect(response.data).toBeUndefined()
  })

  it('default from', async () => {
    const response = await mailchannels.send({
      to: fake.to.string,
      subject: fake.subject,
      html: fake.html,
    })
    expect(response.success).toBe(true)
    expect(response.payload.from).toStrictEqual(nuxtConfig.mailchannels?.from)
    expect(response.data).toBeUndefined()
  })

  it('default to', async () => {
    const response = await mailchannels.send({
      subject: fake.subject,
      html: fake.html,
    })
    expect(response.success).toBe(true)
    expect(response.payload.personalizations[0].to).toStrictEqual([nuxtConfig.mailchannels?.to])
    expect(response.data).toBeUndefined()
  })

  it('overrides bcc', async () => {
    const response = await mailchannels.send({
      bcc: fake.bcc,
      to: fake.to.string,
      subject: fake.subject,
      html: fake.html,
    })
    expect(response.success).toBe(true)
    expect(response.payload.personalizations[0].bcc).toStrictEqual([fake.bcc])
    expect(response.data).toBeUndefined()
  })

  it('overrides cc', async () => {
    const response = await mailchannels.send({
      cc: fake.cc,
      to: fake.to.string,
      subject: fake.subject,
      html: fake.html,
    })
    expect(response.success).toBe(true)
    expect(response.payload.personalizations[0].cc).toStrictEqual([fake.cc])
    expect(response.data).toBeUndefined()
  })

  it('overrides from', async () => {
    const response = await mailchannels.send({
      to: fake.to.string,
      from: fake.from,
      subject: fake.subject,
      html: fake.html,
    })
    expect(response.success).toBe(true)
    expect(response.payload.from).toStrictEqual(fake.from)
    expect(response.data).toBeUndefined()
  })

  it('overrides to', async () => {
    const response = await mailchannels.send({
      to: fake.to.object,
      subject: fake.subject,
      html: fake.html,
    })
    expect(response.success).toBe(true)
    expect(response.payload.personalizations[0].to).toStrictEqual([fake.to.object])
    expect(response.data).toBeUndefined()
  })
})
