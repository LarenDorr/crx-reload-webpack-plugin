declare type LogArgs = {
	logLevel: string,
	outFunc?: Function,
	throwError?: boolean
}
export default class Log{
	private LOG_LEVEL = {
		info: 2,
		warn: 1,
		error: 0
	}
	private level: string
	private outFunc: Function
	private logData: Array<string>
	constructor({logLevel, outFunc}: LogArgs){
		this.level = logLevel
		this.outFunc = outFunc || console.log
		this.logData = []
	}
	info(text: any){
		text = `INFO: ${text}`
		this.saveLog(text)
		this.stdout('info', text)
		// console.log(Function.caller)
	}
	error(error: Error){
		// text = `ERROR: ${text}`
		this.saveLog(error.message)
		// this.stdout('error', text)
		throw error
	}
	warn(text: any){
		text = `WARN: ${text}`
		this.saveLog(text)
		this.stdout('warn', text)
	}
	stdout(level: string,text: string){
		if (this.LOG_LEVEL[level] <= this.LOG_LEVEL[this.level]) {
			this.outFunc(text)
		}
	}
	saveLog(log: string){
		this.logData.push(log)
	}
	setLevel(level: string){
		this.level = level
	}
}