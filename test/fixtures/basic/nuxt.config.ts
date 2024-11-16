import { defineNuxtConfig } from 'nuxt/config'
import myModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [myModule],
  runtimeConfig: {
    mailchannels: {
      apiKey: 'test-api-key',
      dkim: {
        domain: 'example.com',
        privateKey: 'test-private-key',
        selector: 'mailchannels',
      },
    },
  },
  serverDir: '../../../playground/server',
  future: { compatibilityVersion: 4 },
  mailchannels: {
    bcc: { email: 'bcc@example.com', name: 'BCC Test' },
    cc: { email: 'cc@example.com', name: 'CC Test' },
    from: { email: 'from@example.com', name: 'From Test' },
    to: { email: 'to@example.com', name: 'To Test' },
  },
})
