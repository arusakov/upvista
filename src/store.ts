import { parse, Url } from 'url'

import { Pool, PoolConfig } from 'pg'

import { DATABASE_URL } from './env'

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

  if (DATABASE_URL) {
    // todo DATABASE_URL parsing validation
    type UrlStrong = Url & { auth: string, pathname: string }
    const params = parse(DATABASE_URL) as UrlStrong
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

const selectLastVersionSql = `SELECT * FROM versions`

export async function selectLastVersion(db: Pool, versionCapacity: number) {
  const orderParams = Array
    .apply(null, { length: versionCapacity })
    .map((_v: void, i: number) => `version[${i + 1}] DESC`)

  let sql = selectLastVersionSql
  sql += ' ORDER BY ' + orderParams.join(', ')
  sql += ' LIMIT 1;'

  const result = await db.query(sql)
  return result.rowCount ? result.rows[0] : null
}

export async function insertVersion(db: Pool, version: number[], platform: number, url: string) {
  const sql = 'INSERT INTO upv_versions (version, platform, url) VALUES ($1::int[], $2, $3) ' +
    'ON CONFLICT (version, platform) DO UPDATE SET url = excluded.url;'
  await db.query(sql, [version, platform, url])
}
