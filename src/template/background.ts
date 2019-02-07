/* ----------------------------------------*/
/* This code is injected in background.js.
/* Only in development mode.
/* ----------------------------------------*/
(function init(chrome, window: Window) {
	const DIFF_CODE = {
		0: 'NON_CHANGE',
		1: 'MANIFEST_CHANGE',
		2: 'BACKGROUND_CHANGE',
		3: 'POPUP_CHANGE',
		4: 'CONTENT_CHANGE',
		5: 'OPTIONS_CHANGE'
	}
	const port = '<%= port%>'
	const url: string = 'ws://localhost:' + port

	let client

	function createConcect() {
		client = new WebSocket(url)
		client.addEventListener('open', e => {
			console.log('new websocket opend with ' + url + ' .')
		})
		client.addEventListener('message', e => {
			console.log(`recieve data: ` + e.data + ` from server.`)
			handleReload(e.data)
		})
		client.addEventListener('error', e => {
		})
		client.addEventListener('close', e => {
			console.log('websocket with ' + url + ' was closed. May be plugin server was not start.')
			let autoRetry = '<%= autoRetry%>'
			if (autoRetry === 'true') {
				createConcect()				
			}
		})
	}
	createConcect()
	function handleReload(types: Array < string > ) {
		if (types.includes(DIFF_CODE[1])) { // when manifest.json change, reloa extension
			chrome.runtime.reload()
		}
		if (types.includes(DIFF_CODE[2])) { // when background js change, reload background tab
			let tab_id
			chrome.tabs.getCurrent(tab => {
				tab_id = tab.id
			})
			chrome.tabs.reload(tab_id)
		}
		if (types.includes(DIFF_CODE[3])) {
			chrome.runtime.sendMessage({
				data: 'reloadPopup'
			})
		}
		if (types.includes(DIFF_CODE[4])) { // when content js change, reload all tabs
			chrome.tabs.query({}, tabs => {
				tabs.forEach(tab => {
					chrome.tabs.reload(tab.id)
				})
			})
		}
		if (types.includes(DIFF_CODE[5])) {
			chrome.runtime.sendMessage({
				data: 'reloadOptions'
			})
		}
	}
})(chrome, window)

/* ---------crx-reload-plugin end ---------*/
/* ----------------------------------------*/
/* ----------------------------------------*/