import React from "react";
import { FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import { Services } from "../../services.jsx";

export class CategoryList extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            filter: "",
            refreshToggle: false
        }

        this.onCreate = this.onCreate.bind(this)
        this.createByKeyboard = this.createByKeyboard.bind(this)
    }

    onSelect(category){
        this.props.onSelect(category);
        this.setState({
            filter: ""
        });
    }

    onCreate(){
        let sameNameCategory = Services.category.getByName(this.state.filter);
        let category = sameNameCategory ?? Services.category.create(this.state.filter);
        this.onSelect(category);

        //@todo temporaire
        Services.main?.refresh();
        setTimeout(() => {
            Services.main?.refresh();
        }, 0);
    }

    setValue(value){
        this.setState({
            filter: value
        })
    }


    createByKeyboard(event){
        if(event.keyCode == 13){
            this.onCreate();
        }
    }

    render(){
        let categoryList = Object.keys(Services.data.model.categories)
                                 .map((id)=>{return {category: Services.data.model.categories[id],id}})
                                 .filter((item)=>
                                    !this.state.filter ? true:
                                    item.category?.meta?.name?.startsWith(this.state.filter))
                                 .map((item)=>
                                    <ListGroupItem key={item.id} action 
                                        onClick={()=>{this.onSelect(item)}}>
                                        {item.category?.meta?.name}
                                    </ListGroupItem>)

        return <ListGroup>
            <FormControl
                        autoFocus
                        className="mx-3 my-2 w-auto"
                        placeholder="Type to filter..."
                        onChange={(e) => this.setValue(e.target.value)}
                        onKeyDown={this.createByKeyboard}
                        value={this.state.filter}
                    />
            {categoryList}
            {   this.state.filter.length > 0 && !Services.category.getByName(this.state.filter) &&
                <ListGroupItem variant="info" 
                    onClick={this.onCreate}
                    key="_categoryList_CREATE" action
                    >+ Create '{this.state.filter}'</ListGroupItem>
            }
        </ListGroup>
    }
}