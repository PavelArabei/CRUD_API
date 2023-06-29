import * as http from 'http'
import { UserHandler } from '../handlers/userHandler.js'
import { Controller } from './controller.js'

export class Server {
  private isMultiMode: boolean
  private server!: http.Server
  public userHandler: UserHandler

  constructor(private port: number, isMultiMode: boolean) {
    this.isMultiMode = isMultiMode
    this.userHandler = new UserHandler()

    if (isMultiMode) {
      //
    } else {
      const controller = new Controller(this.userHandler)
      this.server = http.createServer(controller.handleRequest)
    }
  }

  public start() {
    this.server.listen(this.port, () => {
      console.log(`Server started and is running on port ${this.port}`)
    })
  }
}
