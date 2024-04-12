import { Schema, model } from 'mongoose'
import { IProduct, ProductStatus } from '../model/product'

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: ProductStatus.ACTIVE, validate: /active|inactive/ },
    price: {
      price: { type: Number },
      priceType: { type: String },
      tax: { type: Number },
      taxType: { type: String },
      discount: { type: Number },
      discountType: { type: String },
      fullPrice: { type: Number },
      fullPriceType: { type: String },
      fullPriceEndDate: { type: Date },
      fullPriceStartDate: { type: Date },
      fullPriceActive: { type: Boolean },
    },
    supportLanguage: [
      {
        '@referentType': { type: String },
        id: { type: String },
        languageCode: { type: String, validate: /^[a-z]{2}/ },
      },
    ],
    deleteDate: { type: Date, default: null },
  },
  {
    timestamps: {
      createdAt: 'createDate',
      updatedAt: 'updateDate',
    },
    toJSON: {
      versionKey: false,
      transform: function (doc, ret) {
        ret.id = ret._id
        ret['@type'] = 'Product'
        ret.href = `${process.env?.PRODUCT_HOST ?? ''}/products/${ret.id}`
        delete ret._id
      },
    },
  }
)

export const ProductModel = model<IProduct>('Product', productSchema)
