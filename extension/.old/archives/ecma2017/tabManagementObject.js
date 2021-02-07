class TabManagementObject{
  //Private fields
  #tabList = new Array();

  constructor(){
      
  }

  /*   Get tabs   */
  #GetAllTabs(){
    let tabList = new Array();
    let ReadTabs = function(tabs){
     
      for (let i = 0; i < tabs.length; i++) {
          tabList.push(new Tab(tabs[i]));
      }
      console.log("FINISHED")
    }
    //Wait for the tab list to be updated
    browser.tabs.query({currentWindow: true, active: false},ReadTabs);
    console("AFTER")
    return new Promise((resolve,reject) =>{
      this.#tabList = tabList;  
      resolve(tabList);
        
    });
  }

  /** Save the tabs */
  async saveTabsInStorage(){
    //Load all tabs
    list = await this.#GetAllTabs();
    console.log(list);
    console.log(this.#tabList);
  }
}