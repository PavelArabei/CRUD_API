import { IncomingMessage, ServerResponse } from 'http'
import { UserHandler } from '../handlers/userHandler.js'
import { MESSAGES, STATUS_CODE } from '../constants/constants.js'

export class Controller {
  constructor(private userHandler: UserHandler) {}

  public handleRequest = (req: IncomingMessage, res: ServerResponse) => {
    const { url, method } = req
    const startUrl = '/api/users'

    if (!url || !url.startsWith(startUrl)) {
      this.sendResponse(res, STATUS_CODE.NOT_EXIST, MESSAGES.INVALID_URL)
      return
    }

    const [api, users, id] = url.split('/')

    if (method === 'GET') {
      if (url === startUrl) this.userHandler.getAllUsers(req, res)
      else this.userHandler.getUserById(req, res, id)
    }

    if (method === 'POST') {
      //
    }
  }

  private sendResponse(res: ServerResponse, statusCode: number, message: string) {
    res.statusCode = statusCode
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ message }))
  }
}
