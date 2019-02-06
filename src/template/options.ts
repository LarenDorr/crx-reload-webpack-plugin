/* ----------------------------------------*/
/* This code is injected in options.js.
/* Only in development mode.
/* ----------------------------------------*/
(function (chrome, window) {
	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		if (message.data === 'reloadOptions') {
			chrome.tabs.getCurrent(tab => {
				chrome.tabs.reload(tab.id)
			})
		}
	})
})(chrome, window)
/* ---------crx-reload-plugin end ---------*/
/* ----------------------------------------*/
/* ----------------------------------------*/