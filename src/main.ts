import './init'

import { readFileSync } from 'fs'
import { createServer } from 'http'

import * as Koa from 'koa'
import * as bodyparser from 'koa-bodyparser'
import * as Router from 'koa-router'

import { AUTH_TOKEN, NODE_ENV, PORT, UPVISTA_CAPACITY } from './env'
import { log } from './log'
import { authenticate } from './middleware'
import { getSquirrelResponse } from './squirrel'
import { createPgPool, insertVersion, selectLastVersion } from './store'
import { createValidator } from './validation'

async function main() {
  const app = new Koa()
  const router = new Router()
  const jsonParser = bodyparser({
    enableTypes: ['json'],
    jsonLimit: '1kb',
  })
  const auth = authenticate(AUTH_TOKEN)
  const validate = createValidator(UPVISTA_CAPACITY)
  const db = createPgPool()

  app.context.db = db // for ctx.db

  router.get('/', (ctx) => {
    ctx.body = 'Hello, It\'s upvista!'
  })

  router.get('/update/:platform/:version', async (ctx) => {
    const vap = validate(ctx.params)
    if (!vap) {
      return ctx.throw(400)
    }
    const row = await selectLastVersion(ctx.db, UPVISTA_CAPACITY, vap.platformId)
    if (row) {
      const latestVersion = row.version.join('.')
      if (ctx.params.version !== latestVersion) {
        ctx.body = getSquirrelResponse(row.url, latestVersion)
        return
      }
    }
    ctx.status = 204 // response is 204 in all other cases
  })

  router.post('/api/versions', auth, jsonParser, async (ctx) => {
    const json = ctx.request.body
    if (!json) {
      return ctx.throw(400)
    }
    // TODO(afrolovskiy): url parsing and validation
    const { url } = json

    const vap = validate(json)
    if (!vap) {
      return ctx.throw(400)
    }

    await insertVersion(ctx.db, vap.version, vap.platformId, url)

    ctx.body = '' // empty response for HTTP OK
  })

  app.use(log)
  app.use(router.routes())
  app.use(router.allowedMethods())

  const server = createServer(app.callback())
  server.on('clientError', (_err: Error, socket: NodeJS.WritableStream) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
  })

  await db.query(readFileSync(__dirname + '/../schema.sql', 'utf8'))

  // start accepting requests if all OK
  server.listen(PORT)
  console.log(`Upvista is running on ${PORT}`) // tslint:disable-line
}

if (NODE_ENV !== 'test') {
  main()
}
