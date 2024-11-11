export default defineEventHandler(async (event) => {
  const mailchannels = useMailChannels(event)
  const response = await mailchannels.send({
    to: 'to@example.com',
    from: 'from@example.com',
    subject: 'Test',
    html: 'Test',
  }, true)

  return { response }
})
