import { Tab } from "../components/tab.component.mjs";
import { TabService } from "./tab.service.mjs";

export class SelectionService{
    constructor(){

        this.onMouseMove = this.onMouseMove.bind(this);
      //  this.onMouseDown = this.onMouseDown.bind(this);
        this.onClick = false;

        window.addEventListener("mousemove",this.onMouseMove);
        window.addEventListener("mousedown",event => {
            this.onClick = true;
        });
        window.addEventListener("mouseup",event => {
            this.onClick = false;
        });

        window.addEventListener("click",event=>{
            if(TabService.mode.selection && !Tab.isElementInTarget(event.target,1)){
                TabService.changeNumberOfSelectedTabs(-1*TabService.mode.selectedTabs);
                TabService.mode.selection = false;
            }
        })

        this.selectedElements = new Array();
        this.unselectedElements = new Array();

    }

    onMouseMove(event){

        if(this.onClick){
            let DOMelement = event.target;
            if(DOMelement.nodeName != "LI"){
                DOMelement = DOMelement.parentElement;
            }
            //Check here if there is an unselection
            // console.log(DOMelement)
            this.onElementHovered(DOMelement);
        }
    }

    onElementHovered(DOMelement){
        let change = false;
        if(this.selectedElements.indexOf(DOMelement) == -1){
            this.selectedElements.push(DOMelement);
            // console.log(this.selectedElements.length)
            change = true;
        }else{
            if (this.selectedElements[this.selectedElements.length - 2] == DOMelement) {
                this.unselectedElements.push(this.selectedElements.pop());
                // console.log(this.selectedElements.length)
                change = true;
            } else {
                //Nothing to do
            }
        }

        if(change){
            this.renderSelection();
        }
    }

    unselectAllTabs(){
        this.unselectedElements = new Array();
        this.selectedElements = new Array();

        TabService.unselectAllTabs();
    }

    renderSelection(){
        this.selectedElements.forEach(element => {
            TabService.getTabByLiElement(element).toggleSelected(true);
        });

        this.unselectedElements.forEach(element =>{
            TabService.getTabByLiElement(element).toggleSelected(false);
        })
    }
}