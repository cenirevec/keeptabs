import { TabService } from "../services/tab.service.mjs";
import { SearchAlgorithm } from "./simpleSearch.algorithm.mjs";

export class SearchBar{
    constructor(DOMelementSelector){
        this.html = document.querySelector(DOMelementSelector);
        this.init();
    }

    init(){
        let searchbar = document.createElement("input");
        searchbar.placeholder = "Search...";
        searchbar.className = "form-control";
        searchbar.type = "text";
        
        searchbar.addEventListener("keyup",event=>{
            let expression = event.target.value;
            SearchBar.search(expression);

            // if (expression == "") {
            //     event.target.nextElementSibling.disabled ='true';
            // } else {
            //     event.target.nextElementSibling.removeAttribute("disabled");
            // }
        })

        // let searchbutton = document.createElement("button");
        // searchbutton.innerText = "Empty search bar";
        // searchbutton.className="btn btn-danger floatting-btn";
        // searchbutton.disabled = "true";

        // searchbutton.addEventListener('click',event =>{
        //     event.target.previousElementSibling.value = "";
        //     event.target.disabled ='true';
        //     SearchBar.search("");
        // });
        this.html.appendChild(searchbar);
        //this.html.appendChild(searchbutton);
    }

    static search(expression){
        var searchAlgorithm = new SearchAlgorithm();

        searchAlgorithm.init(TabService.loadedTabs.main);
        searchAlgorithm.search(expression);        

        TabService.renderSavedTabs();
    }
}