import myModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [myModule],
  runtimeConfig: {
    mailchannels: {
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
    },
  },
})
