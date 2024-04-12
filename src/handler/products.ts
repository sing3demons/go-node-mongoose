import { Request, Response } from 'express'
import { ProductModel } from '../schema/product'
import { IProduct, IProductLanguage, IProductResponse, ProductLanguage } from '../model/product'
import { httpClient } from '../http-client'

async function findProducts(req: Request, res: Response) {
  try {
    const products = await ProductModel.find<IProduct>({
      deleteDate: null,
    }).select({ deleteDate: 0 })

    res.json({
      items: products,
      count: products.length,
    })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
  }
}

async function findProduct(req: Request, res: Response) {
  try {
    const { id } = req.params

    const product = await ProductModel.findById<IProduct>(id).select({ deleteDate: 0 })
    console.log('product', product)
    

    let response: IProductResponse = JSON.parse(JSON.stringify(product))

    let supportLanguage: ProductLanguage[] = []
    if (product?.supportLanguage && product.supportLanguage.length) {
      const productSupportLanguage = []
      for (const lang of product?.supportLanguage || []) {
        // console.log('result===================>', lang.id)
        productSupportLanguage.push(httpClient.get(`http://localhost:1323/productLanguage/${lang.id}`))
        // const result: ProductLanguage = await httpClient.get(`http://localhost:1323/productLanguage/${lang.id}`)
        // console.log('result===================>', result)
        // supportLanguage.push(result)
      }
      const result = await Promise.all(productSupportLanguage)
      console.log('result===================>', result)
      supportLanguage = result
    }

    response.supportLanguage = supportLanguage
    console.log('supportLanguage=========++>', supportLanguage)
    console.log('response.supportLanguage=========++>', response.supportLanguage)

    // const response: IProduct = product as IProduct

    res.json(response)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
  }
}

async function createProduct(req: Request, res: Response) {
  try {
    const product = new ProductModel(req.body)

    const result = await product.save()
    res.json(result)
  } catch (error) {
    console.error(error)

    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
  }
}

async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params

    console.log('id', id)

    const p = await ProductModel.findById(id)
    console.log(p)

    const result = await ProductModel.findOneAndUpdate<IProduct>({ _id: id }, { deleteDate: new Date() }, { new: true })
    res.json(result)
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
  }
}

export default { findProducts, createProduct, deleteProduct, findProduct }
