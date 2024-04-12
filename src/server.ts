import express, { Application, Request, Response, NextFunction } from 'express'
import { connectToDB } from './db'
import { v4 } from 'uuid'

import router from './routes'

class Server {
  static async start() {
    await connectToDB()

    const app: Application = express()
    const port = process.env.PORT || 3000

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(requestLogger())
    app.use(router)

    const server = app.listen(port, () => console.log('Server is running on port ' + port))

    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server')
      server.close(() => process.exit(0))
    })
    process.on('SIGINT', () => {
      console.log('SIGINT signal received: closing HTTP server')
      server.close(() => process.exit(0))
    })
  }
}

function requestLogger() {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = performance.now()
    const session = req.header('x-session-id')
    if (!session) {
      req.headers['x-session-id'] = v4()
    }
    next()
    const originalJson = res.json
    let responseBody = {}
    res.json = function (data) {
      res.json = originalJson
      responseBody = data
      return res.json(data)
    }

    res.on('finish', () => {
      const duration = (performance.now() - start).toFixed(2)
      console.log(
        JSON.stringify({
          method: req.method,
          path: req.path,
          status: res.statusCode,
          duration: duration,
          session: req.headers['x-session-id'],
          result: responseBody || {},
        })
      )
    })
  }
}

export default Server
