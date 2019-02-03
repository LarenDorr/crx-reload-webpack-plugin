import Log from './utils/log'

class SingleLog extends Log{
	private static instance = new SingleLog()
	private constructor(){
		let args: LogArgs = {
			logLevel: 'info',
			throwError: true
		}
		super(args)
	}
	static getLog(): SingleLog{
		return SingleLog.instance
	}
}
export default SingleLog.getLog()