import './init'

import { readFileSync } from 'fs'
import { createServer } from 'http'

import * as Koa from 'koa'
import * as bodyparser from 'koa-bodyparser'
import * as Router from 'koa-router'

import { NODE_ENV, PORT } from './env'
import { createPgPool } from './store'

type PlatformsMap = {
  [index: string]: number | undefined;
}
const platforms: PlatformsMap = require('../platforms.json') // tslint:disable-line

async function main() {
  const app = new Koa()
  const router = new Router()
  const jsonParser = bodyparser({
    enableTypes: ['json'],
    jsonLimit: '1kb',
  })
  const db = createPgPool()

  app.context.db = db // for ctx.db

  router.get('/', (ctx) => {
    ctx.body = 'Hello, It\'s upvista!'
  })

  router.get('/update/:platform/:version', (ctx) => {
    const platformId = platforms[ctx.params.platform]
    if (!platformId) {
      ctx.throw(400)
    }
    ctx.body = { /* response for electron */ }
  })

  router.post('/bodyparser', jsonParser, (ctx) => {
    ctx.body = ctx.request.body
  })

  app.use(router.routes())
  app.use(router.allowedMethods())

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
