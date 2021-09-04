// 1. 创建项目
// 2. npm run dev
import ProjectCreator from './ProjectCreator'
import ProjectDevServer from './ProjectDevSercer'
import ProjectRollupInstance from './ProjectRollupInstance'
class Project {
  private dir: string
  constructor(private name?: string) {
    this.dir = process.cwd()
  }

  public getCwd() {
    return this.dir
  }
  public getName() {
    return this.name
  }
  public setCwd(cwd: string) {
    this.dir = cwd
    // 切换当前shell的工作目录, 类似于 cd this.dir
    process.chdir(this.dir)
  }

  public static create() {
    const creator = new ProjectCreator()
    return creator.create()
  }

  public devServer(port: number) {
    const devServer = new ProjectDevServer(port)
    devServer.start()
  }
  public watch() {
    const rollupInstance = new ProjectRollupInstance()
    rollupInstance.watch()
    // config
    // rollup
  }
}
export default Project
