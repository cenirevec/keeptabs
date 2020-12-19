class TabManagementObject{
 
    constructor(){
        
    }
  
    /** Save the tabs */
    async SaveTabs(){
        //Define function content
        let save = function(tabList){
            console.log(tabList);

            //Saving on a file using C program
            let fileContent = JSON.stringify(tabList);
            
        }

        /*   Get tabs   */
        // This code is redundant to ensure the privacy on ope
        let ReadTabs = function(tabs){
            let tabList = new Array();
            for (let i = 0; i < tabs.length; i++) {
                tabList.push(new Tab(tabs[i]));
            }
            //Callback
            save(tabList);
        }
        // Get the opened tabs
        browser.tabs.query({currentWindow: true, active: false},ReadTabs);      
    }
  }