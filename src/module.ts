import { defineNuxtModule, createResolver, addServerImportsDir } from '@nuxt/kit'
import { defu } from 'defu'
import type { ModuleOptions, NuxtMailChannelsOptions } from './types'

export type { ModuleOptions, NuxtMailChannelsOptions }

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'mailchannels',
    configKey: 'mailchannels',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {
    bcc: '',
    cc: '',
    from: '',
    to: '',
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    addServerImportsDir(resolve('./runtime/server/composables'))

    const runtimeConfig = nuxt.options.runtimeConfig
    runtimeConfig.mailchannels = defu(runtimeConfig.mailchannels, {
      apiKey: '',
      // MailChannels DKIM
      dkim: {
        domain: '',
        privateKey: '',
        selector: '',
      },
      // MailChannels defaults
      bcc: options.bcc,
      cc: options.cc,
      from: options.from,
      to: options.to,
    })

    // App config options
    nuxt.options.appConfig.mailchannels = Object.assign(
      nuxt.options.appConfig.mailchannels || {},
      options,
    )
  },
})
