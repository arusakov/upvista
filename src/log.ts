import { Context } from 'koa'

function log(ip: string, method: string, path: string, status: number, startTime: number): void {
  console.log(`${ip} ${method} ${path} ${status} ${Date.now() - startTime}ms`) // tslint:disable-line
}

export async function logMiddleware(ctx: Context, next: Function) {
  const time = Date.now()
  try {
    await next()
  } catch (e) {
    // todo
    // ctx.throw() maybe is not the best choise for throwing
    log(ctx.ip, ctx.method, ctx.path, typeof e.status === 'number' ? e.status : ctx.status, time)
    throw e
  }
  log(ctx.ip, ctx.method, ctx.path, ctx.status, time)
}
