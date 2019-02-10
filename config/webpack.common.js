const CleanWebpackPlugin = require('clean-webpack-plugin')
const path = require('path')
const pack = require("../package.json")

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
	context: resolve('src'),
	entry: './index.ts',
	devtool: "source-map",
	target: 'node',
	output: {
		filename: 'crxReloadPlugin.js',
		path: resolve('dist'),
		libraryTarget: 'umd',
		globalObject: "typeof self !== 'undefined' ? self : this" // fix'window undefined' bug
	},
	externals: [...Object.keys(pack.dependencies), 'bufferutil', 'utf-8-validate'],
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
		modules: [path.resolve(__dirname, "src"), "node_modules"],
		extensions: ['.ts','.tsx','.js','.json']
	},
	plugins: [
	]
}