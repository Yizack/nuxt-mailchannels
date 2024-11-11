export default defineNuxtConfig({
  modules: [
    'nuxt-mailchannels',
  ],
  imports: {
    autoImport: true,
  },
  devtools: { enabled: true },
  runtimeConfig: {
    mailchannels: {

    },
  },
  compatibilityDate: '2024-11-11',
})
