import { User } from './user.js'

export interface AllUsers {
  users: User[]
}

export interface RedirectOptions {
  path: string | undefined
  port: number
  method: string | undefined
}
