import express, { Express } from 'express'
import { projPathResolve } from './resolver'
import chalk from 'chalk'

export default class ProjectDevServer {
  app: Express
  constructor(public port: number) {
    this.app = express()
  }

  start() {
    this.app.get('/', (req, res) => {
      res.sendFile(projPathResolve('index.html'))
    })
    this.app.use('/', express.static(projPathResolve('./build')))
    const port = this.port

    this.app.listen(port, () => {
      console.log(chalk.greenBright('successfully listen @' + port))
    })
  }
}
