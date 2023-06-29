import 'dotenv/config'
import * as process from 'process'
import { Server } from './server/server.js'

const port = process.env.PORT || 4000
const host = process.env.HOST
const server = new Server(+port, false)

server.start()
