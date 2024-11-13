export default defineNuxtConfig({
  modules: [
    '../src/module',
  ],
  imports: {
    autoImport: true,
  },
  devtools: { enabled: true },
  runtimeConfig: {
    mailchannels: {
      apiKey: '',
      dkim: {
        domain: '',
        privateKey: '',
        selector: '',
      },
    },
  },
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-11-11',
  mailchannels: {
    from: {
      email: 'custom@example.com',
    },
  },
})
