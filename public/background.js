if(chrome != undefined && chrome.action != undefined){
    chrome.action.onClicked.addListener(() => {
        chrome.tabs.create({"url": "/home.html"});
    });
}else{
    browser.browserAction.onClicked.addListener(() => {
        browser.tabs.create({"url": "/home.html"});
    });
}