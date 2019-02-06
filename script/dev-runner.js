const webpack = require('webpack')
const WebSocket = require('ws')
const devConfig = require('../config/webpack.dev')
const path = require('path')

let port
let complier = webpack(devConfig)
complier.watch({
	aggregateTimeout: 1000
}, (err,stats) => {
	if (!err) {
		console.log('--------------------WebPack working--------------------')
		console.log('>>Plugin was packed!')
		if (port) { // fix plugin's server recreate caused repeat port error
			let ws = new WebSocket(`ws://localhost:${port}`)
			ws.onopen = () => {
				ws.send('CLOSE')
			}
			ws.onmessage = message => {
				if (message.data === 'TRUE') {
					packExt()
				}
			}
		} else {
			packExt()
		}
	}
})


function packExt(){
	const extConfig = require('../config/webpack.extension')
	port = extConfig.plugins[0].port
	let complier = webpack(extConfig)
	complier.watch({
		aggregateTimeout: 300
	}, (err, stats) => {
		if (!err) {
			console.log('>>Extension was packed!')
		}
	})
	delete require.cache[require.resolve('../config/webpack.extension.js')]
	delete require.cache[require.resolve('../dist/crxReloadPlugin.js')]
}
