import path from 'path'
export function projPathResolve(relativePath: string) : string{
	return path.resolve(process.cwd(), relativePath)
} 