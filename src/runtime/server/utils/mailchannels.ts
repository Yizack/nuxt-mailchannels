import type { H3Event } from 'h3'
import { MailChannels } from '../../mailchannels'
import type { NuxtMailChannelsOptions } from '../../../types'
import { useAppConfig, useRuntimeConfig } from '#imports'

export const useMailChannels = (event?: H3Event) => {
  const runtimeConfig = useRuntimeConfig(event).mailchannels
  const appConfig = useAppConfig().mailchannels as NuxtMailChannelsOptions
  return new MailChannels({ ...runtimeConfig, ...appConfig })
}
