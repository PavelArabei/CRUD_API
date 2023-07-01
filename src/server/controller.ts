import { IncomingMessage, ServerResponse } from 'http'
import { UserHandler } from '../handlers/userHandler.js'
import { MESSAGES, STATUS_CODE } from '../constants/constants.js'

export class Controller {
  constructor(private userHandler: UserHandler) {}

  public handleRequest = (req: IncomingMessage, res: ServerResponse) => {
    const { url, method } = req
    const startUrl = '/api/users'

    try {
      if (!url || !url.startsWith(startUrl)) throw new Error()

      const [id, someAdditionalUrl] = url.split('/').slice(3)

      if (someAdditionalUrl) throw new Error()
      if (method === 'POST' && id) throw new Error()
      if (method === 'PUT' && !id) throw new Error()

      if (method === 'GET' && !id) this.userHandler.getAllUsers(req, res)
      if (method === 'POST' && !id) this.userHandler.createUser(req, res)

      if (id) {
        if (method === 'GET') this.userHandler.getUserById(req, res, id)
        if (method === 'PUT') this.userHandler.updateUser(req, res, id)
        if (method === 'DELETE') this.userHandler.deleteUser(req, res, id)
      }
    } catch (err) {
      this.sendResponse(res, STATUS_CODE.NOT_EXIST, MESSAGES.INVALID_URL)
    }
  }

  private sendResponse(res: ServerResponse, statusCode: number, message: string) {
    res.statusCode = statusCode
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ message }))
  }
}
