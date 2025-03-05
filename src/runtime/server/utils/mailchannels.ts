import type { H3Event } from 'h3'
import { MailChannels } from '../../mailchannels'
import { useRuntimeConfig } from '#imports'

export const useMailChannels = (event?: H3Event) => {
  const runtimeConfig = useRuntimeConfig(event).mailchannels
  return new MailChannels(runtimeConfig)
}
