export const overrideRecipient = <T>(
  config: NonNullable<T>,
  override?: T,
): T | undefined => {
  if (config
    && ((typeof config === 'object' && Object.keys(config).length === 0)
      || (Array.isArray(config) && config.length === 0)
    )) {
    return override
  }

  const recipient = override || config

  if (
    typeof recipient === 'object'
    && 'name' in recipient
    && 'email' in recipient
    && !recipient.name
    && !recipient.email
  ) {
    return undefined
  }

  return recipient
}
