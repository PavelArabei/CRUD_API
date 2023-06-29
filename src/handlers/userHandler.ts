import { User } from '../models/user.js'
import { IncomingMessage, ServerResponse } from 'http'
import { AllUsers } from '../models/requestData.js'
import { MESSAGES, STATUS_CODE } from '../constants/constants.js'

export class UserHandler {
  private users: User[] = []

  public getAllUsers(req: IncomingMessage, res: ServerResponse) {
    this.sendResponse(res, 200, { users: this.users })
  }

  public getUserById(req: IncomingMessage, res: ServerResponse, userId: string) {
    if (!userId || !this.isValidUUID(userId)) {
      this.sendResponse(res, STATUS_CODE.INVALID, MESSAGES.INVALID_ID)
      return
    }

    const user = this.users.find((user) => user.id === userId)

    if (user) this.sendResponse(res, STATUS_CODE.OK, user)
    else this.sendResponse(res, STATUS_CODE.NOT_EXIST, MESSAGES.NON_EXISTENT)
  }

  private sendResponse(res: ServerResponse, statusCode: number, data: AllUsers | string | User) {
    res.statusCode = statusCode
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(data))
  }

  private isValidUUID(id: string) {
    const uuidRegex = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/
    return uuidRegex.test(id)
  }
}
