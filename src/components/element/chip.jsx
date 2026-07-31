import React, { Component } from "react";
import { FormControl } from "react-bootstrap";

export class Chip extends Component {
    constructor(props) {
        super(props);

        this.state = { children: this.props.children, inEditMode: false }
        this.onEdit = this.onEdit.bind(this);
    }

    /**
     * Action to do when a chip is being edited
     * @param {*} event 
     */
    onEdit(event) {
        this.props.onEdit(event.target.value);
    }

    /**
     * Set to edition mode
     * @param {*} isInEditMode 
     */
    setEditMode(isInEditMode){
        this.setState({inEditMode: isInEditMode})
    }


    render() {
        return <span onDoubleClick={()=>this.setEditMode(true)} className="kt kt-component kt-component-chip">
            {!this.props.children && this.props.value}

            {!this.props.onEdit || !this.state.inEditMode && this.props.children}
            {(!!this.props.onEdit && this.state.inEditMode) && 
                <FormControl onBlur={()=>this.setEditMode(false)} autoFocus={true} type="text" defaultValue={this.props.children} onInput={this.onEdit}></FormControl>}
            {!!this.props.onRemove &&
                <svg onClick={this.props.onRemove}
                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill closeBttn" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                </svg>
            }

        </span>
    }
}

export default Chip;