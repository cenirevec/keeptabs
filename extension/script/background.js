console.log("Bonjour");

var browser = (browser != undefined) ? browser : chrome;

browser.browserAction.onClicked.addListener(() => {
    browser.tabs.create({"url": "/keeptabs.htm"});
});

