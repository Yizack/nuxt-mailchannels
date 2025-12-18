export default defineEventHandler(async (event) => {
  const mailchannels = useMailChannels(event)
  const { success, data, error } = await mailchannels.send({
    from: 'Name From <from@example.com>',
    to: 'to@example.com',
    subject: 'Test',
    html: '<p>Hello {{ world }}</p>',
    text: 'Hello {{ world }}',
    mustaches: {
      world: 'World',
    },
  }, true)

  if (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: `Failed to send email: ${error.message}`,
    })
  }

  console.info({ data })

  return { success }
})
