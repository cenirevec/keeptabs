import { Tab } from "../../components/tab.component.mjs";
import { Subject } from "../lib/self/Subject.mjs";
import { TabService } from "./tab.service.mjs";

export class SelectionService{

    selectedElements = new Array();
    unselectedElements = new Array();

    /** Subjects */
    selectionChangeSubject = new Subject();

    constructor(){

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onClick = false;

        window.addEventListener("mousemove",this.onMouseMove);
        window.addEventListener("mousedown",event => {
            this.onClick = true;
        });
        window.addEventListener("mouseup",event => {
            this.onClick = false;
            this.unselectedElements = new Array();
            this.selectedElements = new Array();
        });

        window.addEventListener("click",this.unselectAllTabs)     

    }

    /**
     * Method to run when the mouse moves over elements
     * @param event Event handler
     */
    onMouseMove(event){

        if(this.onClick){
            let DOMelement = event.target;
            if (DOMelement != null) {
                if(DOMelement.nodeName != "LI"){
                    DOMelement = DOMelement.parentElement;
                }
                if(DOMelement.identifier != undefined){
                    //Check here if there is an unselection
                    this.onElementHovered(DOMelement);
                }
            } else {
                
            }
            
        }
        if (!TabService.mode.selection) {
            this.unselectedElements = new Array();
            this.selectedElements = new Array();
        }

    }

    /**
     * Method to execute each time a DOM Element is hovered by the mouse
     * @param DOMelement DOM Element hovered by the mouse
     */
    onElementHovered(DOMelement){

        // FAIRE QUE TOUS LES ÉLÉMENTS ENTRE DEUX POSITIONS SOOIENT SÉLECTIONNÉS

        let change = false;
        if(this.selectedElements.indexOf(DOMelement) == -1){
            this.selectedElements.push(DOMelement);

            let indexInUnselected = this.unselectedElements.indexOf(DOMelement);
            if(indexInUnselected != -1){
                this.unselectedElements.splice(indexInUnselected,1);
            }
            change = true;
        }else{
            //console.log(this.selectedElements.indexOf(DOMelement));
            if (this.selectedElements[this.selectedElements.length - 2] == DOMelement) {
                if(this.selectedElements.length > 1){
                    this.unselectedElements.push(this.selectedElements.pop());
                    change = true;
                }
            } else {
                //Nothing to do
            }
        }

        if(change){
            this.renderSelection();
            //console.log(this.selectedElements.slice(),this.unselectedElements.slice());
        }
    }

    /**
     * Unselect all the tabs
     * @param { } event 
     */
    unselectAllTabs(event){
        if(TabService.mode.selection && !Tab.isElementInTarget(event.target,1)){
            this.unselectedElements = new Array();
            this.selectedElements = new Array();
    
            TabService.unselectAllTabs();
        }
    }

    /**
     * Render the selection of tabs
     */
    renderSelection(){
        this.selectedElements.forEach(element => {
            TabService.getTabByLiElement(element).toggleSelected(true);
        });

        for (let index = 0; index < this.unselectedElements.length; ) {
            const element = this.unselectedElements[index];

            TabService.getTabByLiElement(element).toggleSelected(false);
            this.unselectedElements.splice(index,1);
        }

        this.selectionChangeSubject.next(this.selectedElements)
    }
}