function mainHandler(tabId, changeInfo, tab) {
	if(tab) {
		if (tab.url.indexOf('https://toggl.com') == 0) {
			chrome.pageAction.show(tabId);
		}
	}
}



chrome.tabs.onUpdated.addListener(mainHandler);
chrome.tabs.onCreated.addListener(mainHandler);