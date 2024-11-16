export default defineEventHandler(async (event) => {
  const mailchannels = useMailChannels(event)
  const response = await mailchannels.send({
    from: 'Dimatis <from@example.com>',
    to: 'to@example.com',
    subject: 'Test',
    html: '<p>Hello {{ world }}</p>',
    mustaches: {
      world: 'World',
    },
  }, true)

  return response
})
