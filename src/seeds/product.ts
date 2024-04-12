import { faker } from '@faker-js/faker'
import { IProduct } from '../model/product'
import { v4 } from 'uuid'
import { connectToDB } from '../db'
import { ProductModel } from '../schema/product'
import KafkaService from '../kafka'

interface ProductLanguage {
  '@type'?: string
  id: string
  href?: string
  languageCode: string
  name?: string
  version?: string
  lastUpdate?: string
  attachment?: Attachment[]
}

interface Attachment {
  '@type'?: string
  id: string
  href?: string
  description?: string
  mimeType?: string
  name?: string
  url?: string
  redirectUrl?: string
  displayInfo?: DisplayInfo
}

interface DisplayInfo {
  valueType?: string
  value?: string[]
}

function mockProduct() {
  const productEn: ProductLanguage = {
    id: v4(),
    languageCode: 'en',
    name: faker.commerce.productName(),
    lastUpdate: new Date().toISOString(),
    attachment: [
      {
        id: v4(),
        mimeType: 'image/png',
        url: faker.image.imageUrl(),
      },
    ],
  }

  const productTh: ProductLanguage = {
    id: v4(),
    languageCode: 'th',
    name: faker.commerce.productName(),
    lastUpdate: new Date().toISOString(),
    attachment: [
      {
        id: v4(),
        mimeType: 'image/png',
        url: productEn?.attachment?.[0].url || faker.image.imageUrl(),
      },
    ],
  }

  const product: IProduct = {
    name: productEn?.name || '',
    description: faker.commerce.productDescription(),
    price: {
      priceType: 'fixed',
      price: Number(faker.commerce.price()),
      unit: '฿',
    },
    '@type': 'Product',
    status: 'active',
    supportLanguage: [
      {
        '@referentType': 'ProductLanguage',
        id: productEn?.id || '',
        languageCode: 'en',
      },
      {
        '@referentType': 'ProductLanguage',
        id: productTh?.id || '',
        languageCode: 'th',
      },
    ],
    deleteDate: null,
  }
  return {
    product,
    productTh,
    productEn,
  }
}

async function seedProduct() {
  const products: IProduct[] = [],
    productLanguage: ProductLanguage[] = []
  for (let i = 0; i < 100; i++) {
    const { product, productEn, productTh } = mockProduct()
    products.push(product)
    productLanguage.push(productEn)
    productLanguage.push(productTh)
  }
  try {
    await connectToDB()

    // if (productLanguage.length) {
    //   await KafkaService.PublishMessage('createProductLanguage', productLanguage)
    // }

    // console.log('inserting', products.length, 'products')
    // const result = await ProductModel.insertMany<IProduct>(products)
    // console.log(result.length, 'products inserted')

    const result = await Promise.all([
      KafkaService.PublishMessage('createProductLanguage', productLanguage),
      ProductModel.insertMany<IProduct>(products),
    ])
    console.log('result', result)
  } catch (error) {
    console.error(error)
  }
}

seedProduct().then(() => {
  process.exit(0)
})
