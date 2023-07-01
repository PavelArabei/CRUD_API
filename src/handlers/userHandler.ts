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
    if (!this.isUserIdValid(userId, res)) return

    const user = this.users.find((user) => user.id === userId)

    if (user) this.sendResponse(res, STATUS_CODE.OK, user)
    else this.sendResponse(res, STATUS_CODE.NOT_EXIST, MESSAGES.NON_EXISTENT)
  }

  public createUser(req: IncomingMessage, res: ServerResponse): void {
    this.requestProcessing(req, res, this.createUserLogic)
  }

  public updateUser(req: IncomingMessage, res: ServerResponse, userId: string): void {
    if (!this.isUserIdValid(userId, res)) return
    this.requestProcessing(req, res, this.updateUserLogic, userId)
  }

  public deleteUser(req: IncomingMessage, res: ServerResponse, userId: string) {
    if (!this.isUserIdValid(userId, res)) return

    const index = this.users.findIndex((user) => user.id === userId)

    if (index !== -1) {
      this.users.splice(index, 1)
      this.sendResponse(res, STATUS_CODE.DELETED, null)
    } else {
      this.sendResponse(res, STATUS_CODE.NOT_EXIST, MESSAGES.NON_EXISTENT)
    }
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

  private updateUserLogic = (requestBody: string, res: ServerResponse, userId?: string) => {
    try {
      const { username, age, hobbies } = JSON.parse(requestBody)

      if (!username || !age || !hobbies) throw new Error()

      const user = this.users.find((user) => user.id === userId)

      if (user) {
        user.username = username
        user.age = age
        user.hobbies = hobbies

        this.sendResponse(res, STATUS_CODE.OK, user)
      } else this.sendResponse(res, STATUS_CODE.NOT_EXIST, MESSAGES.NON_EXISTENT)
    } catch (error) {
      this.sendResponse(res, STATUS_CODE.INVALID, MESSAGES.INVALID_REQUEST_BODY)
    }
  }

  private sendResponse(res: ServerResponse, statusCode: number, data: AllUsers | string | User | null) {
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
    currentFunction: (recBody: string, response: ServerResponse, userId?: string) => void,
    userId?: string,
  ) {
    let requestBody = ''

    req.on('data', (chunk) => {
      requestBody += chunk.toString()
    })

    req.on('end', () => {
      currentFunction(requestBody, res, userId)
    })
  }

  private createUserObject(username: string, age: number, hobbies: string[]): User {
    return {
      id: uuidv4(),
      username,
      age,
      hobbies,
    }
  }

  private isUserIdValid(userId: string, res: ServerResponse) {
    if (!userId || !this.isValidUUID(userId)) {
      this.sendResponse(res, STATUS_CODE.INVALID, MESSAGES.INVALID_ID)
      return false
    } else {
      return true
    }
  }
}
