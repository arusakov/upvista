import { Context, Middleware } from 'koa'

export function authenticate(token: string): Middleware {
  return (ctx: Context, next: Function) => {
    if (!token) {
      return ctx.throw(401)
    }
    const header  = ctx.headers.authorization
    if (!header) {
      return ctx.throw(401)
    }
    const parts = header.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer' || parts[1] !== token) {
      return ctx.throw(401)
    }
    return next()
  }
}
