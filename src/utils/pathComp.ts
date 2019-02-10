import * as path from 'path'

export function pathInPath(path1: string, path2: string) {
	// compare path2(dir or file) include or equal pat1(file)
	// path2 is file
	if (path1 === path2) {
		return true
	}
	// path2 is dir
	let path1Arr = path1.split(path.sep)
	let path2Arr = path2.split(path.sep)
	if (path2Arr.length >= path1Arr.length) {
		return false
	} else {
		let res: boolean
		for (let i = 0; i < path2Arr.length; i++) {
			if (path2Arr[i] === path1Arr[i]) {
				res = true
			} else {
				res = false
				break
			}
		}
		return res
	}
}

export function pathInPaths(path1: string, path2: Array < string > ): boolean {
	return path2.some(path => pathInPath(path1, path))
}
export function pathsInPaths(path1: Array < string > , path2: Array < string > ) {
	return path1.some(path => pathInPaths(path, path2))
}