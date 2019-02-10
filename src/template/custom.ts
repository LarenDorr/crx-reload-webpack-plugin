/* ----------------------------------------*/
/* This code is injected in your custom js file.
/* Only in development mode.
/* ----------------------------------------*/
(function (chrome, window) {
	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		if (message.data === '<%= name%>') {
			chrome.tabs.getCurrent(tab => {
				chrome.tabs.reload(tab.id)
			})
		}
	})
})(chrome, window)
/* ---------crx-reload-plugin end ---------*/
/* ----------------------------------------*/
/* ----------------------------------------*/