export interface IProduct {
  id?: string
  name: string
  '@type'?: string
  href?: string
  status?: string
  description?: string
  price?: IPrice
  supportLanguage?: IProductLanguage[]
  startDate?: Date
  endDate?: Date
  deleteDate?: Date | null
}

export interface IProductResponse {
  id?: string
  name?: string
  '@type'?: string
  href?: string
  status?: string
  description?: string
  price?: IPrice
  startDate?: Date
  endDate?: Date
  deleteDate?: Date | null
  supportLanguage?: ProductLanguage[]
}

export interface IProductLanguage {
  '@referentType'?: string
  id?: string
  languageCode?: string
}

export interface IPrice {
  price?: number
  priceType?: string
  unit?: string
  tax?: number
  taxType?: string
  discount?: number
  discountType?: string
  fullPrice?: number
  fullPriceType?: string
  fullPriceEndDate?: Date
  fullPriceStartDate?: Date
  fullPriceActive?: boolean
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inActive',
}

export interface ProductLanguage {
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
