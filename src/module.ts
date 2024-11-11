import { defineNuxtModule, createResolver, addServerImportsDir } from '@nuxt/kit'
import { defu } from 'defu'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'mailchannels',
    configKey: 'mailchannels',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {},
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    addServerImportsDir(resolve('./runtime/server/utils'))

    const runtimeConfig = nuxt.options.runtimeConfig
    // MailChannels settings
    runtimeConfig.mailchannels = defu(runtimeConfig.mailchannels, {
      apiKey: '',
      dkim: {
        domain: '',
        selector: '',
        privateKey: '',
      },
    })
  },
})
