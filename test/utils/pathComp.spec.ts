// @ts-ignore
import * as pathComp from 'utils/pathComp'
debugger

describe('test utils pathComp', () => {
	test('pathInPath', () => {
		let path1 = 'c:\\a\\b\\c.js'
		let path2 = 'c:\\a\\b'
		expect(pathComp.pathInPath(path1, path2)).toBe(true)
		path1 = 'c:\\a\\b'
		path2 = 'c:\\a\\b\\c'
		expect(pathComp.pathInPath(path1, path2)).toBe(false)
		path1 = 'c:\\a\\b'
		path2 = 'c:\\a\\b'
		expect(pathComp.pathInPath(path1, path2)).toBe(true)
		path1 = 'c:\\a\\b\\c.js'
		path2 = 'c:\\a\\b.js'
		expect(pathComp.pathInPath(path1, path2)).toBe(false)
	})
	test('pathInPaths', () => {
		let path1 = 'c:\\a\\b\\c.js'
		let path2 = ['c:\\a\\b']
		expect(pathComp.pathInPaths(path1, path2)).toBe(true)
		path1 = 'c:\\a\\b'
		path2 = ['c:\\a\\b\\c']
		expect(pathComp.pathInPaths(path1, path2)).toBe(false)
		path1 = 'c:\\a\\b'
		path2 = ['c:\\a\\b']
		expect(pathComp.pathInPaths(path1, path2)).toBe(true)
	})
	test('pathsInPaths', () => {
		let paths1 = ['c:\\a\\b', 'c:\\a\\c.js']
		let paths2 = ['c:\\a\\b', 'c:\\d']
		expect(pathComp.pathsInPaths(paths1, paths2)).toBe(true)
	})
})