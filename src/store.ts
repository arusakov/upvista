import { parse, Url } from 'url'

import { Pool, PoolConfig } from 'pg'

declare module 'koa' {
  export interface Context {
    db: Pool
  }
}

export function createPgPool(): Pool {
  let config: PoolConfig = {
    database: 'upvista',
    max: 20,
  }

  if (process.env.NODE_ENV === 'production') {
    type UrlStrong = Url & { auth: string, pathname: string }
    const params = parse(process.env.DATABASE_URL) as UrlStrong
    const auth = params.auth.split(':')

    config = {
      database: params.pathname.split('/')[1],
      host: params.hostname,
      max: 20,
      password: auth[1],
      port: Number(params.port),
      ssl: true,
      user: auth[0],
    }
  }
  const pool = new Pool(config)
  pool.on('error', (err) => {
    console.error('Postgres error:', err)
  })
  return pool
}
