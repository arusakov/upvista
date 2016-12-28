import './init'

import { readFileSync } from 'fs'
import { createServer } from 'http'

import Koa = require('koa')

import { createPgPool } from './store'

async function main() {
  const PORT = Number(process.env.PORT) || 5555

  const app = new Koa()
  const db = createPgPool()

  app.context.db = db // for ctx.db

  app.use((ctx) => {
    ctx.body = 'Hello, It\'s upvista!'
  })

  const server = createServer(app.callback())
  server.on('clientError', (_err: Error, socket: NodeJS.WritableStream) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
  })

  await db.query(readFileSync(__dirname + '/schema.sql', 'utf8'))

  // start accepting requests if all OK
  server.listen(PORT)
  console.log(`Upvista is running on ${PORT}`) // tslint:disable-line
}

if (process.env.NODE_ENV !== 'test') {
  main()
}
