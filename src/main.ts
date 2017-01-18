import './init'

import { readFileSync } from 'fs'
import { createServer } from 'http'

import * as Koa from 'koa'
import * as bodyparser from 'koa-bodyparser'
import * as Router from 'koa-router'

import { NODE_ENV, PORT, UPVISTA_CAPACITY } from './env'
import { createPgPool, insertVersion } from './store'

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

  router.get('/update/:platform/:version', async(ctx) => {
    // TODO(afrolovskiy): url parsing and validation
    const url = 'http://127.0.0.1/'

    const platformId = platforms[ctx.params.platform]
    if (!platformId) {
      return ctx.throw(400)
    }

    const version = parseVersion(ctx.params.version)
    if (!version) {
      return ctx.throw(400)
    }

    await insertVersion(ctx.db, version, platformId, url)

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

function parseVersion(s: string): number[] | null {
  const parts = s.split('.')

  if (parts.length < UPVISTA_CAPACITY) {
    return null
  }

  const versions: number[] = []
  for (const p of parts) {
    const v = Number(p)
    if (isNaN(v) || v < 0) {
      return null
    }
    versions.push(v)
  }

  return versions

}

if (NODE_ENV !== 'test') {
  main()
}
