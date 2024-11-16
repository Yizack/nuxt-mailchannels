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
    bcc: {
      email: process.env.NUXT_MAILCHANNELS_BCC_EMAIL,
      name: process.env.NUXT_MAILCHANNELS_BCC_NAME,
    },
    cc: {
      email: process.env.NUXT_MAILCHANNELS_CC_EMAIL,
      name: process.env.NUXT_MAILCHANNELS_CC_NAME,
    },
    from: {
      email: process.env.NUXT_MAILCHANNELS_FROM_EMAIL,
      name: process.env.NUXT_MAILCHANNELS_FROM_NAME,
    },
    to: {
      email: process.env.NUXT_MAILCHANNELS_TO_EMAIL,
      name: process.env.NUXT_MAILCHANNELS_TO_NAME,
    },
  },
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

    nuxt.options.appConfig.mailchannels = Object.assign(
      nuxt.options.appConfig.mailchannels || {},
      options,
    )
  },
})
