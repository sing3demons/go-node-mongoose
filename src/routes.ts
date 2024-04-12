import { Router } from 'express'
import userHandler from './handler/users'
import productHandler from './handler/products'
import KafkaService from './kafka'

const router = Router()

router.get('/products/:id', productHandler.findProduct)
router.get('/products', productHandler.findProducts)
router.post('/products', productHandler.createProduct)

router.get('/users', userHandler.findUsers)
router.post('/users', userHandler.createUser)

export default router
