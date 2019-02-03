import WebSocket = require('ws')
import logger from './logger'

export default class Server {
	private port: number
	private server: WebSocket.Server // in webpack crx-reload plugin
	private client: WebSocket // in extension's chrome
	constructor() {
		this.port = 9999
	}
	launch() {
		this.server = new WebSocket.Server({
			port: this.port
		}, () => {
			logger.info(`WebSocket was launched on port ${this.port}`)
		})
		this.server.on('error', (e) => {
			logger.error(e)
		})
		this.server.on('connection', (ws, req) => {
			this.client = ws
			this.regHandles()
		})
	}
	regHandles() { // reg client event handle
		this.client.on('message', data => {
			this.handleClientRequest(data)
		})
		this.client.on('close', (code,reason) => {
			let info = `client was close with ${code}`
			if (reason) {
				info += `, because ${reason}`
			}
			logger.info(info)
		})
	}
	handleClientRequest(data: WebSocket.Data) {
		logger.info(data.toString())
	}
	send(data: WebSocket.Data){
		logger.info(`server was send ${data}`)
		this.client.send(data)
	}
	judgeDiff(){
		/* judge the diff files, then send to chrome client to reload, have 3 situation
		1. manifest.js file was changed, need reload the extension
		2. options.html file was changed, need reload the options tab
		3. content script file was changed, may be need reload all tab
		*/
		// TODO
	}
}