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
		try {
			this.server = new WebSocket.Server({
				port: this.port
			}, () => {
				logger.info(`WebSocket was launched on port ${this.port}`)
			})
		} catch (error) {
			logger.error(error)
		}
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
	send(data: any){
		if (this.client) {
			this.client.send(data)
			logger.info(`server was send ${data}`)
		}
	}
}