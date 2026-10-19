import { useRuntimeConfig, defineEventHandler } from 'nuxt/server'

export default defineEventHandler(() => {
  return useRuntimeConfig().mailchannels
})
