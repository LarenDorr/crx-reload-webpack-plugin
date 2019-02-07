import Log from './utils/log'

class SingleLog extends Log{
	private static instance = new SingleLog()
	private static level: string
	private constructor(){
		super({
			logLevel: 'error',
			throwError: true
		})
	}
	static getLog(): SingleLog{
		return SingleLog.instance
	}
	static setLevel(level: string){
		this.level = level
	}
}
export default SingleLog.getLog()