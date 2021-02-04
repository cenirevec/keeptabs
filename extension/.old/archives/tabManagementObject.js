function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

var _tabList = new WeakMap();

var _GetAllTabs = new WeakSet();

class TabManagementObject {
  //Private fields
  constructor() {
    _GetAllTabs.add(this);

    _tabList.set(this, {
      writable: true,
      value: new Array()
    });
  }
  /*   Get tabs   */


  /** Save the tabs */
  async SaveTabs() {
    //Load all tabs
    list = await _classPrivateMethodGet(this, _GetAllTabs, _GetAllTabs2).call(this);
    console.log(list);
    console.log(_classPrivateFieldGet(this, _tabList));
  }

}

var _GetAllTabs2 = function _GetAllTabs2() {
  let tabList = new Array();

  let ReadTabs = function (tabs) {
    for (let i = 0; i < tabs.length; i++) {
      tabList.push(new Tab(tabs[i]));
    }

    console.log("FINISHED");
  }; //Wait for the tab list to be updated


  browser.tabs.query({
    currentWindow: true,
    active: false
  }, ReadTabs);
  console.log("AFTER");
  return new Promise((resolve, reject) => {
    _classPrivateFieldSet(this, _tabList, tabList);

    resolve(tabList);
  });
};