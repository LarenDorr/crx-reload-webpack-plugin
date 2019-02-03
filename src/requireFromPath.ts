import logger from './logger'

export default function requireFromPath(filePath: string): Manifest{
	let obj: Manifest
	try {
		let nativeRequire = __non_webpack_require__ // us node native require
		obj = nativeRequire(filePath)
		logger.info(`required ${filePath}.`)
		delete nativeRequire.cache[filePath]
		logger.info(`deleted require(${filePath}) cache`)
	} catch (error) {
		logger.error(error)
	}
	return obj
}