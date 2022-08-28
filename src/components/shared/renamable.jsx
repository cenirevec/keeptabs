import React from "react";

export class Renamable extends React.Component{
    
    callbacks = {
        onChange : null,
        onSubmit : null
    }
    edition = false;
    valid = true;


    constructor(props){
        super(props);

        if(props.onSubmit)
            this.callbacks.onSubmit = props.onSubmit;

        if(props.onChange)
            this.callbacks.onChange = props.onChange;
        
        this.state = {
            value: props.value
        }

        this.enableEdition = this.enableEdition.bind(this);
        this.setValue = this.setValue.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    enableEdition(){
        this.edition = true;
    }

    /**
     * Actions to do when the value changes
     */
    setValue(event){
        if(this.callbacks.onChange)
            this.valid = this.callbacks.onChange(this.state.value);

        this.setState({value: event.target.value});
    }

    handleSubmit(event){
        if(this.callbacks.onSubmit && this.valid)
            this.callbacks.onSubmit(this.state.value);

        this.edition = false;
        event.preventDefault();
    }

    /**
     * 
     * @returns 
     */
    render(){
        return <span onDoubleClick={this.enableEdition}>
            {!this.edition && this.state.value}
            {this.edition &&
                <form onSubmit={this.handleSubmit}>
                    <input type="text" value={this.state.value} onChange={this.setValue}/>
                    <button onClick={this.handleSubmit}>Submit</button>
                </form>
            }
        </span>
    }
}