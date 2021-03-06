#!/usr/bin/env node

import chalk from 'chalk'
import parse from 'yargs-parser'
import Project from './Project'

const argv = parse(process.argv)

const cmd = argv._[2]
if (!cmd) {
  console.log(chalk.red('Command is needed'))
  process.exit(-1) // 退出进程
}
async function run() {
  switch (cmd) {
    case 'create':
      await Project.create()
      break
    case 'dev':
			const project = new Project()
			// Facade 设计模式
			const port = argv.port
			project.devServer(port)
			project.watch()
			break
  }
  console.log(chalk.gray('finished'))
}

run()
