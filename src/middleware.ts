import * as Koa from 'koa'

export function authenticate(token: string): Koa.Middleware {
  return async(ctx: Koa.Context, next: Function) => {
    if (!token || !ctx.headers.authorization) {
      return ctx.throw(401)
    }
    const parts = ctx.headers.authorization.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer' || parts[1] !== token) {
      return ctx.throw(401)
    }
    await next()
  }
}
