import { IncomingMessage, ServerResponse } from 'http'
import { UserHandler } from '../handlers/userHandler.js'

export class Controller {
  constructor(private userHandler: UserHandler) {}

  public handleRequest = (req: IncomingMessage, res: ServerResponse) => {
    const { url, method } = req
    console.log(url)

    console.log(this.userHandler.getAllUsers)

    if (url === '/api/users' && method === 'GET') {
      this.userHandler.getAllUsers(req, res)
    }
  }
}
