import './init'

import { readFileSync } from 'fs'
import { createServer } from 'http'

import Koa = require('koa')

import { NODE_ENV, PORT } from './env'
import { createPgPool } from './store'

async function main() {
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

if (NODE_ENV !== 'test') {
  main()
}
