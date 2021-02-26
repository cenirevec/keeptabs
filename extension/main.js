import { DataService } from "./services/data.service.mjs";
import { TabService } from "./services/tab.service.mjs";
import { Browser } from "./components/shared.variables.mjs";
import { SearchBar } from "./components/searchBar.component.mjs"
import { SelectionService } from "./services/selection.service.mjs";

var data = new DataService();
var tab = new TabService(data);
var select = new SelectionService();

//Load old elements
DataService.load("_init",TabService.loadMoods);

/*
var savebttn = document.querySelector("#saveCurrent");
savebttn.addEventListener("click",TabService.saveCurrentTabs);
*/

/*
var refbttn = document.querySelector("#refresh");
refbttn.addEventListener("click",TabService.getCurrentlyOpenTabs);

var closebttn = document.querySelector("#closeAll");
closebttn.addEventListener("click",TabService.closeAllTabs);
*/


var dropAllbttn =  document.querySelector("#dropAll");
dropAllbttn.addEventListener("click",TabService.removeAllTabsFromStorage);


var refAllbttn = document.querySelector("#refreshAll");
//refAllbttn.addEventListener("click",TabService.render);

let version = Browser.runtime.getManifest().version;
document.getElementById("manifest-version").innerHTML = version+"-dev";

let search = new SearchBar("#searchbox");
