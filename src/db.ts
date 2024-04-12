import { connect } from 'mongoose'

async function connectToDB() {
  await connect('mongodb://mongodb1:27017,mongodb2:27018,mongodb3:27019/service_product?replicaSet=my-replica-set')
  console.log('Connected to MongoDB')
}

export { connectToDB }
