// import KafkaService from './kafka'
import dotenv from 'dotenv'
import Server from './server'
import { KafkaService } from '@node-kafka-service/sing3demons'
import express from 'express'
const app = express()

app.use(express.json())

app.post('/', (req, res) => {
  console.log('req', req.body)
  res.send('Hello World!')
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})


dotenv.config({
  path: (process.env?.NODE_ENV !== 'production' && '.env.dev') || '.env',
})

// Server.start()
// KafkaService.CreateTopics()
// KafkaService.SubscribeToTopic(['createProductLanguage'])
