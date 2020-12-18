console.log("Bonjour");

var browser = (browser != undefined) ? browser : chrome;

browser.browserAction.onClicked.addListener(() => {
    browser.tabs.create({"url": "/main.html"});
});