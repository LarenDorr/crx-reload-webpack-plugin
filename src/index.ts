import AbstractPlugin from "./abstractPlugin"
import { ConcatSource } from 'webpack-sources'
import { Compiler } from "webpack"
import logger from './logger'
import Server from './server'
import requireFromPath from './requireFromPath'

const pluginTapName = 'crx-Reload'
export = class ReloadPlugin extends AbstractPlugin{
	private manifest: Manifest
	private manifestPath: string
	private server: Server
	constructor({manifest}: Options){
		super()
		this.manifestPath = manifest
		this.server = new Server()
		this.server.launch()
	}
	getManifest(){
		this.manifest = requireFromPath(this.manifestPath)
	}
	apply(complier: Compiler){
		complier.hooks.beforeRun.tap(pluginTapName, complier => {
			// TODO 处理manifest, 建立服务器
			// TODO check args
			complier
			this.getManifest()
		})
		complier.hooks.compilation.tap(pluginTapName, compilation => {
			compilation.hooks.afterOptimizeChunkAssets.tap(pluginTapName, chunks => {
				// TODO 判断chunk, 注入代码
				chunks
			})
		})
		complier.hooks.emit.tap(pluginTapName, compilation => {
			// TODO 生成manifest.json
			compilation
		})
		complier.hooks.afterEmit.tap(pluginTapName, compilation => {
			// 通知client刷新
			compilation
		})
	}
}
