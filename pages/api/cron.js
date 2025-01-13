export default function handler(req, res) {
  console.log('headers::', req.headers)

  console.log('process.env.CRON_SECRET', process.env.CRON_SECRET)

  console.log('Checkout the env..')

  //   if (req.headers['Authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
  //     return res.status(401).end('Unauthorized')
  //   }

  res.status(200).end('Hello Cron!')
}
