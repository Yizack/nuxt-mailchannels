export default defineEventHandler(async (event) => {
  const mailchannels = useMailChannels(event)
  const { data, error } = await mailchannels.send({
    from: 'Name From <from@example.com>',
    to: 'to@example.com',
    subject: 'Test',
    html: '<p>Hello {{ world }}</p>',
    text: 'Hello {{ world }}',
    template: {
      type: 'mustache',
      data: {
        world: 'World',
      },
    },
  }, true)

  if (error) {
    throw createError({
      status: error.statusCode || 500,
      message: `Failed to send email: ${error.message}`,
    })
  }

  console.info({ data })

  return { data }
})
