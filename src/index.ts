import AbstractPlugin from "./abstractPlugin"

export = class ReloadPlugin extends AbstractPlugin{
	constructor(){
		super()
	}
	apply(){
		console.log('crx-reload-plugin was loaded!!')
	}
}
