import { parse } from 'url'

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
    const params = parse(DATABASE_URL)
    const auth = params.auth ? params.auth.split(':') : ['', '']

    config = {
      database: params.pathname && params.pathname.substr(1),
      host: params.hostname,
      max: 20,
      password: auth[1],
      port: Number(params.port),
      user: auth[0],
    }
  }
  const pool = new Pool(config)
  pool.on('error', (err) => {
    console.error('Postgres error:', err)
  })

  process.on('SIGINT', async() => {
    await pool.end()
    process.exit(0)
  })

  return pool
}

type VersionRow = {
  id: number
  version: number[]
  platform: number
  url: string
}

const selectLastVersionSql = `SELECT * FROM upv_versions WHERE platform = $1`

export async function selectLastVersion(db: Pool, versionCapacity: number, platformId: number) {
  const orderParams = Array
    .apply(null, { length: versionCapacity })
    .map((_v: void, i: number) => `version[${i + 1}] DESC`)

  let sql = selectLastVersionSql
  sql += ' ORDER BY ' + orderParams.join(', ')
  sql += ' LIMIT 1;'

  const result = await db.query(sql, [platformId])
  return result.rowCount ? result.rows[0] as VersionRow : null
}

export async function insertVersion(db: Pool, version: number[], platform: number, url: string) {
  const sql = 'INSERT INTO upv_versions (version, platform, url) VALUES ($1::int[], $2, $3) ' +
    'ON CONFLICT (version, platform) DO UPDATE SET url = excluded.url;'
  await db.query(sql, [version, platform, url])
}
