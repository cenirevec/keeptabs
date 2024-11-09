export class ContextualBar{
    modeList = ["selection"];
    enabled = false;

    buttons = {
        enabledBttns: 0,
        unselectBttn: document.createElement("button"),
        selectBttn: document.createElement("button"),
        removeBttn: document.createElement("button"),
        openAllBttn: document.createElement("button"),
    }
    

    constructor(selectionService){
        this.buttons = new Array();
        this.createAndInitialize();

        this.selectionService = selectionService;
    }
    
    /**
     * Create an initialize all buttons
     */
    createAndInitialize(){
        this.target = document.createElement("nav");
        this.target.id = "contextual-bar";
        
        //Button to unselect all
        this.buttons.unselectBttn = document.createElement("button");
        this.buttons.unselectBttn.className = "btn btn-primary";
        this.buttons.unselectBttn.innerText = "Unselect All";
        this.target.appendChild(this.buttons.unselectBttn);
        
        //Button to select all
        this.buttons.selectBttn = document.createElement("button");
        this.buttons.selectBttn.className = "btn btn-primary";
        this.buttons.selectBttn.innerText = "Select All";
        this.target.appendChild(this.buttons.selectBttn);

        //Button to remove all
        this.buttons.removeBttn = document.createElement("button");
        this.buttons.removeBttn.className = "btn btn-danger";
        this.buttons.removeBttn.innerText = "Remove All";
        this.target.appendChild(this.buttons.removeBttn);

        //Button to open all
        this.buttons.openAllBttn = document.createElement("button");
        this.buttons.openAllBttn.className = "btn btn-success";
        this.buttons.openAllBttn.innerText = "Open All";
        this.target.appendChild(this.buttons.openAllBttn);
        
        this.hideAllbuttons();
        document.body.append(this.target);
    }


    /**
     * Hide all the buttons in the contextual bar
     */
    hideAllbuttons(){
        for(let name in this.buttons){
            if (name != "enabledBttns") {
                this.buttons[name].style.display = "none";
            }
        }

        this.buttons.enabledBttns = 0;
        this.refresh();
    }

    /**
     * Show a button by its name
     * @param name Name of the button to show
     * @returns 
     */
    showButton(name){
        if(this.buttons[name] == undefined){
            console.error(`The button ${name} doesn't exists`);
            return;
        }
        this.buttons[name].style.display = "";

        this.buttons.enabledBttns++;
        this.refresh();
    }

    /**
     * Select the mode in which open the contextual footer menu
     * @param {"selection"|null} mode 
     */
    selectMode(mode){
        if (this.modeList.indexOf(mode) == -1) {
            console.warn(`Contextual bar cannot switch to this mode (mode: ${mode})`);
        } else {
            this.hideAllbuttons();
            switch (mode) {
                case "selection":
                    this.showButton("openAllBttn")
                    this.showButton("removeBttn")
                    this.showButton("unselectBttn");
                    break;
            
                default:
                    this.refresh();
                    break;
            }
            this.refresh();
        }
    }

    /**
     * Refresh the contextual footer menu
     */
    refresh(){
        /** Determine if the contextual bar need to be shown */
        if (this.buttons.enabledBttns <= 0) {
            this.enabled = false;

            /** This value should not be possible */
            if (this.buttons.enabledBttns < 0) {
                this.buttons.enabledBttns = 0;
                console.error("ERRVAL001 - Error value 001")
            }
        } else {
            this.enabled = true;
        }

        /** Show and render */
        if(this.enabled){
            this.target.style.display = "";
        }else{
            this.target.style.display = "none";
        }
    }

    /**
     * Not defined yet
     */
    onSelectionChange(){
        throw new Exception("Not implemented yet")
    }

    /**
     * Actions to do when the Open All button is clicked
     */
    onOpenAll(){
        throw new Exception("Not implemented yet")
    }

    /**
     * Actions to do when the Remove All button is clicked
     */
    onRemoveAll(){
        throw new Exception("Not implemented yet")
    }

    /**
     * Actions to do when the Select All button is clicked
     */
    onSelectAll(){
        throw new Exception("Not implemented yet")
    }

    /**
     * Actions to do when the Unselect All button is clicked
     */
    onUnselectAll(){
        throw new Exception("Not implemented yet") 
    }

}