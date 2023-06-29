import { User } from '../models/user.js'
import { IncomingMessage, ServerResponse } from 'http'

export class UserHandler {
  private users: User[] = []

  public getAllUsers(req: IncomingMessage, res: ServerResponse) {
    this.sendResponse(res, 200, this.users)
  }

  private sendResponse(res: ServerResponse, statusCode: number, data: any) {
    res.statusCode = statusCode
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(data))
  }
}
