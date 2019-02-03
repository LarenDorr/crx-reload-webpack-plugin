const webpack = require('webpack')
const devConfig = require('../config/webpack.dev')
const path = require('path')

let complier = webpack(devConfig)
complier.watch({
	aggregateTimeout: 1000
}, (err,stats) => {
	if (!err) {
		console.log('--------------------WebPack working--------------------')
		console.log('>>Plugin was packed!')
		packExt()
	}
})


function packExt(){
	const extConfig = require('../config/webpack.extension')
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