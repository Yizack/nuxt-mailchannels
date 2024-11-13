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
    from: {
      email: 'test@example.com',
      name: 'Test',
    },
  },
})
