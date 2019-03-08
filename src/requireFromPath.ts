import logger from './logger'

export default function requireFromPath(filePath: string): Manifest{
	let obj: Manifest
	debugger
	try {
		let nativeRequire = __non_webpack_require__ // us node native require
		obj = nativeRequire(filePath)
		logger.info(`required ${filePath}.`)
		// fix memory leak
		let parent = nativeRequire.cache[filePath].parent
		let index = parent.children.indexOf(nativeRequire.cache[filePath])
		if (index >= 0) {
			parent.children.splice(index, 1)			
		}
		delete nativeRequire.cache[filePath]
		
		logger.info(`deleted required manifest cache`)
	} catch (error) {
		logger.error(error)
	}
	return obj
}