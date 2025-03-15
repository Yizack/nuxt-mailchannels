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
  return override || config
}
