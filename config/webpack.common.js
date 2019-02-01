const path = require('path')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
	context: resolve('src'),
	entry: './index.ts',
	output: {
		filename: 'crxReloadPlugin.js',
		path: resolve('dist'),
		libraryTarget: 'umd',
		globalObject: "typeof self !== 'undefined' ? self : this" // fix'window undefined' bug
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['.ts','.tsx','.js','.json']
	}
}