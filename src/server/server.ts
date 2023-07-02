import * as http from 'http'
import { UserHandler } from '../handlers/userHandler.js'
import { Controller } from './controller.js'
import { cpus } from 'os'

import cluster from 'cluster'
import { IncomingMessage, ServerResponse } from 'http'
import * as process from 'process'
import { MESSAGES, STATUS_CODE } from '../constants/constants.js'
import { RedirectOptions } from '../models/requestData.js'

export class Server {
  public userHandler: UserHandler
  public workersPorts: number[] = []
  public currentIndex = 0
  private DBPort = 2500

  constructor(private port: number, isMultiMode: boolean) {
    this.userHandler = new UserHandler()

    if (isMultiMode) {
      if (cluster.isPrimary) {
        this.DBServer()
        const server = http.createServer(this.balancer.bind(this, this.workersPorts, this.changeIndex))
        const worckerCount = cpus().length - 1

        for (let i = 0; i < worckerCount; i++) {
          const workerPort = this.port + i + 1
          this.workersPorts.push(workerPort)

          cluster.fork({ PORT: this.port + i + 1 })
        }

        server.listen(this.port, () => {
          console.log(`Server started and is running on port ${this.port}`)
        })
      } else {
        const port = +process.env.PORT!

        const server = http.createServer(this.redirectToDB.bind(this))
        server.listen(port, () => {
          console.log(`Server started and is running on port ${port}`)
        })
      }
    } else {
      this.DBServer()
      const mainServer = http.createServer(this.redirectToDB.bind(this))
      mainServer.listen(this.port, () => {
        console.log(`Main server started and is running on port ${this.port}`)
      })
    }
  }

  private DBServer = () => {
    const controller = new Controller(this.userHandler)
    const serverDB = http.createServer(controller.handleRequest)

    serverDB.listen(this.DBPort, () => {
      console.log(`DB server started and is running on port ${this.DBPort}`)
    })
  }

  private redirectToDB(req: IncomingMessage, res: ServerResponse) {
    const requestOptions = {
      path: req.url,
      port: this.DBPort,
      method: req.method,
    }
    this.redirectRequest(requestOptions, req, res)
  }

  public changeIndex = () => {
    const prevIndex = this.currentIndex
    this.currentIndex += 1
    if (this.currentIndex === this.workersPorts.length) this.currentIndex = 0
    return prevIndex
  }

  private balancer(workersPorts: number[], changeIndex: () => number, req: IncomingMessage, res: ServerResponse) {
    const i = changeIndex()

    const requestOptions = {
      path: req.url,
      port: workersPorts[i],
      method: req.method,
    }

    this.redirectRequest(requestOptions, req, res)
  }

  public redirectRequest(requestOptions: RedirectOptions, req: IncomingMessage, res: ServerResponse) {
    const requestToWorker: http.ClientRequest = http.request(
      'http://localhost',
      requestOptions,
      (responseFromWorker) => {
        res.statusCode = responseFromWorker.statusCode!
        for (const header in responseFromWorker.headers) {
          res.setHeader(header, responseFromWorker.headers[header]!)
        }
        responseFromWorker.pipe(res)
      },
    )

    req.pipe(requestToWorker).on('error', () => {
      res.statusCode = STATUS_CODE.SERVER_ERROR
      res.end(MESSAGES.SERVER_ERROR)
    })
  }
}
