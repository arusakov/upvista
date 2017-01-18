export const NODE_ENV: 'production' | 'development' | 'test' = process.env.NODE_ENV || 'development'

// tcp port
export const PORT: number = process.env.PORT || 5555

// postgres connection url
export const DATABASE_URL = process.env.DATABASE_URL || ''

// version capacity, for 3 version will be look like N.N.N
export const UPVISTA_CAPACITY: number = process.env.UPVISTA_CAPACITY || 3

// authorization token
export const AUTH_TOKEN = process.env.AUTH_TOKEN
