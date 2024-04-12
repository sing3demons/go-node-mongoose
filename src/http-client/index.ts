import axios from 'axios'

export const httpClient = {
  get: async (url: string, headers?: Record<string, string>) => {
    console.log('url', url)
    if (!headers) {
      headers = {
        'Content-Type': 'application/json',
      }
    }
    try {
      const response = await axios.request({
        url,
        method: 'get',
        headers,
        timeout: 10000,
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
  post: async (url: string, data: any, headers?: Record<string, string>) => {
    if (!headers) {
      headers = {
        'Content-Type': 'application/json',
      }
    }
    try {
      const response = await axios.request({
        url,
        method: 'post',
        data,
        headers,
        timeout: 10000,
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
  put: async (url: string, data: any, headers?: any) => {
    try {
      const response = await axios.put(url, data, { headers })
      return response.data
    } catch (error) {
      throw error
    }
  },
  delete: async (url: string, headers?: any) => {
    try {
      const response = await axios.delete(url, { headers })
      return response.data
    } catch (error) {
      throw error
    }
  },
}
