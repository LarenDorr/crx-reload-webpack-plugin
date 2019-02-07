import {
	ConcatSource
} from 'webpack-sources'
import {
	Compiler,
	compilation
} from 'webpack'
import {
	template
} from 'lodash'
import * as path from 'path'
import AbstractPlugin from "./abstractPlugin"
import logger from './logger'
import Server from './server'
import requireFromPath from './requireFromPath'
import * as templateCode from './template'
import {
	pathsInPaths
} from './utils/pathComp'
import CONSTANT from './constant'
// TODO TEST
const pluginTapName = 'crx-Reload'
export = class ReloadPlugin extends AbstractPlugin {
	private manifest: Manifest
	private manifestPath: string
	private port: number
	private paths: ListenPaths
	private server: Server
	private autoRetry: boolean
	constructor({
		manifest,
		port,
		paths,
		logLevel,
		autoRetry
	}: Options) {
		super()
		this.manifestPath = manifest
		this.paths = paths || {}
		this.port = port || 9999
		this.autoRetry = autoRetry || false
		this.server = new Server()
		this.server.launch()
		logger.setLevel(logLevel || 'error')
	}
	apply(complier: Compiler) {
		// @ts-ignore: Unreachable code error
		this.checkPath(complier.context)
		this.getManifest()
		let mode = complier.options.mode
		if (mode === 'development') {
			complier.hooks.watchRun.tap(pluginTapName, complier => {
				// @ts-ignore: Unreachable code error
				let changedFile = Object.keys(complier.watchFileSystem.watcher.mtimes)
				if (changedFile.includes(this.manifestPath)) {
					this.getManifest()
				}
			})
			complier.hooks.compilation.tap(pluginTapName, compilation => {
				compilation.hooks.afterOptimizeChunkAssets.tap(pluginTapName, chunks => {
					this.injectCode(compilation, chunks)
				})
			})
			complier.hooks.afterEmit.tap(pluginTapName, compilation => {
				this.noticeClient(compilation)
			})
		}
		complier.hooks.emit.tap(pluginTapName, compilation => {
			this.generateMainifest(compilation)
		})
		complier.hooks.watchClose.tap(pluginTapName, () => {
			this.server.close(() => {
				logger.info(`server ${this.port} was closed.`)
			})
		})
	}
	getManifest() {
		this.manifest = requireFromPath(this.manifestPath)
		logger.info(`get manifest.js content`)
	}
	checkPath(context: string) {
		this.paths.background = this.paths.background || [path.resolve(context, 'background/')]
		this.paths.options = this.paths.options || [path.resolve(context, 'options/')]
		this.paths.popup = this.paths.popup || [path.resolve(context, 'popup/')]
		this.paths.content = this.paths.content || [path.resolve(context, 'content/')]
		logger.info(`listen paths: ↓`)
		for (const path in this.paths) {
			if (this.paths.hasOwnProperty(path)) {
				logger.info(`${path}: ${this.paths[path]}`)
			}
		}
	}
	injectCode(compilation: compilation.Compilation, chunks: compilation.Chunk[]) {
		let complier = compilation.compiler
		let isInjected = {
			background: false,
			options: false,
			popup: false
		}
		chunks.forEach(chunk => {
			let files = chunk.files
			files.forEach(file => {
				// @ts-ignore: Unreachable code error
				let filePath = path.resolve(complier.context, file)
				if (path.extname(file) === '.js') {
					let temp: string // need inject code string
					switch (true) {
						case pathsInPaths(filePath, this.paths.background): // background js file
							if (!isInjected.background) {
								temp = template(templateCode.background)({
									port: this.port,
									autoRetry: this.autoRetry
								})
								isInjected.background = true
							}
							break;
						case pathsInPaths(filePath, this.paths.options): // options js file
							if (!isInjected.options) {
								temp = template(templateCode.options)({})
								isInjected.options = true
							}
							break;
						case pathsInPaths(filePath, this.paths.popup): // background js file
							if (!isInjected.popup) {
								temp = template(templateCode.popup)({})
								isInjected.popup = true
							}
							break;
						default:
							break;
					}
					if (temp) {
						compilation.assets[file] = new ConcatSource(temp, compilation.assets[file])
						logger.info(`inject ${chunk.name} chunk in ${file} file.`)
					}
				}
			})
		})
	}
	generateMainifest(compilation: compilation.Compilation) {
		compilation.fileDependencies.add(this.manifestPath)
		let manifestJSON = JSON.stringify(this.manifest)
		compilation.assets['manifest.json'] = {
			source: () => manifestJSON,
			size: () => manifestJSON.length
		}
		logger.info(`generate manifest.json`)
	}
	noticeClient(compilation: compilation.Compilation) {
		let complier = compilation.compiler
		// @ts-ignore: Unreachable code error // fix @types/webpack watchFileSystem undeclare error
		let changed = Object.keys(complier.watchFileSystem.watcher.mtimes)
		/* judge the diff files, then send to chrome client to reload, have 3 situation
		1. manifest.js file was changed, need reload the extension
		2. options.html file was changed, need reload the options tab
		3. content script file was changed, may be need reload all tab
		4. background.js file was changed, need reload background.html
		*/
		let diff = this.judgeDiff(changed)
		logger.info(`file change result: ${diff.length ? diff : 'none'}`)
		diff.forEach(code => {
			this.server.send(code)
		})
	}
	judgeDiff(changed: Array < string > ): Array < string > {
		if (changed.length === 0) {
			return []
		}
		let changedFile = changed
		let inBackgroundPaths = pathsInPaths(changedFile, this.paths.background) // 2
		let inPopupPaths = pathsInPaths(changedFile, this.paths.popup) // 3
		let inContentPaths = pathsInPaths(changedFile, this.paths.content) // 4
		let inOptionsPaths = pathsInPaths(changedFile, this.paths.options) //5
		let res: Array < string > = []
		if (changedFile[0] === this.manifestPath) {
			res.push(CONSTANT.DIFF_CODE[1])
		}
		if (inBackgroundPaths) {
			res.push(CONSTANT.DIFF_CODE[2])
		}
		if (inPopupPaths) {
			res.push(CONSTANT.DIFF_CODE[3])
		}
		if (inContentPaths) {
			res.push(CONSTANT.DIFF_CODE[4])
		}
		if (inOptionsPaths) {
			res.push(CONSTANT.DIFF_CODE[5])
		}
		return res
	}
}