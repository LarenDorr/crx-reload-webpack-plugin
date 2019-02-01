const webpack = require('webpack')
const devConfig = require('../config/webpack.dev')


let complier = webpack(devConfig)
complier.watch({
	aggregateTimeout: 300
}, (err,stats) => {
	if (!err) {
		console.log('>>Plugin was packed!')
		packExt()
	}
})


function packExt(){
	const extConfig = require('../config/webpack.extension')
	let complier = webpack(extConfig)
	complier.run((err, stats) => {
		if (!err) {
			console.log('>>Extension was packed!')
		}
	})
}