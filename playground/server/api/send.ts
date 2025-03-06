export default defineEventHandler(async (event) => {
  const mailchannels = useMailChannels(event)
  const response = await mailchannels.send({
    from: 'Name From <from@example.com>',
    to: 'to@example.com',
    subject: 'Test',
    html: '<p>Hello {{ world }}</p>',
    text: 'Hello {{ world }}',
    mustaches: {
      world: 'World',
    },
  }, true)

  return response
})
