import { fstat } from 'fs'
import inquirer, { restoreDefaultPrompts } from 'inquirer'
import path from 'path'
import fs from 'fs'
import chalk from 'chalk'
import { runCmd } from './cmdRunner'
import Project from './Project'

export default class ProjectCreator {
  public async create() {
    const projectType = await this.askProjectType()
    const projectName = await this.inputProjectName()

    const project = new Project(projectName)
    await runCmd(`mkdir ${projectName}`, {
      cwd: project.getCwd(),
    })

    project.setCwd(path.resolve(project.getCwd(), projectName))

    switch (projectType) {
      case 'react + ts':
        this.copyReactTemplateFiles(project)
        break
      case 'vue + ts':
        break
      default:
        break
    }

    return project
  }

  private async inputProjectName() {
    const result = await inquirer.prompt({
      name: 'name',
      message: "What's your project name:",
      type: 'input',
    })
    if (!result.name) {
      return await this.inputProjectName()
    }
    return result.name
  }
  private async askProjectType() {
    const result = await inquirer.prompt({
      name: 'type',
      message: "What's your project type:",
      default: 'react + ts',
      choices: ['react + ts', 'vue + ts'],
    })
    return result.type
  }
  private copyReactTemplateFiles(project: Project) {
		console.log(chalk.gray("copy files..."));
		
    const tplBase = path.resolve(__dirname, '../templates/react-ts')
		const envs: Record<string, string> = {}
		envs["PROJECT_NAME"] = project.getName()
		console.log(tplBase, '<====tplbase=======')
		
    this.recursiveCopy(tplBase, project.getCwd(), envs)
  }
  private recursiveCopy(
    from: string,
    to: string,
    envs: Record<string, string>
  ) {
    if (!fs.existsSync(to)) {
      fs.mkdirSync(to)
    }
    const files = fs.readdirSync(from)
    files.forEach(file => {
      const fullnameFrom = path.resolve(from, file)
      const fullnameTo = path.resolve(to, file)
      if (fs.statSync(fullnameFrom).isDirectory()) {
        this.recursiveCopy(fullnameFrom, fullnameTo, envs)
        return
      }

      if (fullnameFrom.match(/.(json|js|jsx|ts|tsx|yml|yaml)/)) {
        const content = fs
          .readFileSync(fullnameFrom, 'utf-8')
          .replace(/\{\{.*\}\}/g, x => {
            x = x.replace('{{', '')
            x = x.replace('}}', '')
            x = x.trim()
            return envs[x]
          })
        fs.writeFileSync(fullnameTo, content, 'utf-8')
      } else {
        fs.copyFileSync(fullnameFrom, fullnameTo)
      }
    })
  }
}
