if(chrome != undefined && chrome.action != undefined){
    chrome.action.onClicked.addListener(() => {
        chrome.tabs.create({"url": "/home.html"});
    });
}else{
    browser.browserAction.onClicked.addListener(() => {
        browser.tabs.create({"url": "/home.html"});
    });
}

//console.log(chrome.windows.WINDOW_ID_CURRENT)

//{tabId,currentWindow}
/*
chrome.tabs.onActivated.addListener((event)=>{
    console.log(event)
})
*/

//console.log(browser)