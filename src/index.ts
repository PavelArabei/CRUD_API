import 'dotenv/config'
import * as process from 'process'
import { Server } from './server/server.js'

const port = process.env.PORT || 4000
const host = process.env.HOST

const isMultiMode = process.argv.slice(2).find((el) => el === '--multi')

new Server(+port, !!isMultiMode)
