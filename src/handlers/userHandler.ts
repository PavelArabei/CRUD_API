import { User } from '../models/user.js'
import { IncomingMessage, ServerResponse } from 'http'
import { AllUsers } from '../models/requestData.js'
import { MESSAGES, STATUS_CODE } from '../constants/constants.js'
import { v4 as uuidv4 } from 'uuid'

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

  public createUser(req: IncomingMessage, res: ServerResponse) {
    this.requestProcessing(req, res, this.createUserLogic)
  }

  private createUserLogic = (requestBody: string, res: ServerResponse) => {
    try {
      const { username, age, hobbies } = JSON.parse(requestBody)

      if (!username || !age || !hobbies) throw new Error()

      const newUser: User = this.createUserObject(username, age, hobbies)
      this.users.push(newUser)

      this.sendResponse(res, STATUS_CODE.CREATED, newUser)
    } catch (error) {
      this.sendResponse(res, STATUS_CODE.INVALID, MESSAGES.INVALID_REQUEST_BODY)
    }
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

  private requestProcessing(
    req: IncomingMessage,
    res: ServerResponse,
    currentFunction: (recBody: string, response: ServerResponse) => void,
  ) {
    let requestBody = ''

    req.on('data', (chunk) => {
      requestBody += chunk.toString()
    })

    req.on('end', () => {
      currentFunction(requestBody, res)
    })
  }

  private createUserObject(username: string, age: number, hobbies?: string[]): User {
    return {
      id: uuidv4(),
      username,
      age,
      hobbies: hobbies || [],
    }
  }
}
