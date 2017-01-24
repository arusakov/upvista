import { Context } from 'koa'

export async function log(ctx: Context, next: Function) {
  const time = Date.now()
  await next()

  // todo replacte ctx.throw with custom function
  console.log(`${ctx.ip} ${ctx.method} ${ctx.path} ${ctx.status} ${Date.now() - time}ms`) // tslint:disable-line
}
