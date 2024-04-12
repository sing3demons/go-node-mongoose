import { Kafka, Message, logLevel } from 'kafkajs'

const brokers = process.env?.KAFKA_BROKERS?.split(',') || ['localhost:9092']
const clientId = process.env?.KAFKA_CLIENT_ID
const groupId = process.env?.KAFKA_GROUP_ID || 'kafka-group'

const kafka = new Kafka({
  clientId,
  brokers: brokers,
  logLevel: logLevel.INFO,
  requestTimeout: 25000,
  retry: {
    factor: 0,
    multiplier: 4,
    maxRetryTime: 25000,
    retries: 10,
  },
})

const producer = kafka.producer()
const consumer = kafka.consumer({ groupId })

const logger = kafka.logger()
const admin = kafka.admin()

async function CreateTopics() {
  const topics = process.env?.KAFKA_TOPICS?.split(',') || []
  await admin.connect()

  const listTopic = await admin.listTopics()
  const existingTopics = listTopic.filter((topic) => topics.includes(topic))
  const newTopics = topics.filter((topic) => !existingTopics.includes(topic))

  if (newTopics.length) {
    await admin.createTopics({
      topics: newTopics.map((topic) => ({
        topic,
        numPartitions: 1,
      })),
    })
  }

  logger.info('Topic detail', {
    listTopic,
    existingTopics,
    newTopics,
  })

  await admin.disconnect()
}

async function PublishMessage(topic: string, payload: object) {
  try {
    await producer.connect()

    if (typeof payload !== 'object') {
      throw new Error('Payload must be an object')
    }

    const messages: Message[] = []

    if (Array.isArray(payload)) {
      payload.forEach((value) => {
        if (typeof value !== 'object') {
          throw new Error('Payload must be an object')
        }

        messages.push({
          value: JSON.stringify(value),
        })
      })
    } else {
      messages.push({ value: JSON.stringify(payload) })
    }

    const record = await producer.send({
      topic,
      messages,
    })
    logger.info('Publishing message to kafka', {
      topic,
      messages,
      record,
    })
    //   await producer.disconnect()
  } catch (error) {
    logger.error('Error publishing message to kafka', {
      topic,
      payload,
      error,
    })
  }
}

async function SubscribeToTopic(topics: string[]) {
  try {
    await consumer.connect()
    await consumer.subscribe({ topics, fromBeginning: true })
    logger.info('Subscribed to topics', { topics })

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        logger.info('Received message from kafka', {
          topic,
          partition,
          message: message.value?.toString(),
        })
      },
    })
  } catch (error) {
    logger.error('Error subscribing to topics', { topics, error })
  }
}

const KafkaService = {
  PublishMessage,
  SubscribeToTopic,
  CreateTopics,
}

export default KafkaService
