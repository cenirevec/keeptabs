import React from "react";
//import "./renamable.css"

export class Renamable extends React.Component{
    
    callbacks = {
        onChange : null,
        onSubmit : null
    }

    constructor(props){
        super(props);

        if(props.onSubmit)
            this.callbacks.onSubmit = props.onSubmit;

        if(props.onChange)
            this.callbacks.onChange = props.onChange;
        
        this.state = {
            value: props.value ?? "",
            edition: false,
            valid: true
        }

        this.enableEdition = this.enableEdition.bind(this);
        this.setValue = this.setValue.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleOutsideClick = this.handleOutsideClick.bind(this);

        // Reference to the input
        this.textInput = React.createRef();
    }

    componentDidUpdate(newProps){
        if(!this.state.edition && newProps.value != this.state.value){
            this.setState({value: newProps.value});
        }
    }

    enableEdition(){
        // Switch to edition mode
        this.setState({edition: true});

        //Preselect the text
        setTimeout((_self = this)=>{
            _self.textInput.current.select();
            // When the user clicks outside of the input
            document.body.onclick = this.handleOutsideClick
        },0)
    }

    /**
     * Actions to do when the value changes
     */
    setValue(event){
        /* if(this.callbacks.onChange){
            this.setState({valid: this.callbacks.onChange(this.state.value)})
        } */
        
        this.setState({value: event.target.value});
    }

    handleSubmit(event){
        if(this.state.edition){
            this.setState({edition: false});
            if(this.callbacks.onSubmit && this.state.valid){
                this.callbacks.onSubmit(this.state.value);
            }
            
            if(event) event.preventDefault();
        }
    }

    handleOutsideClick(event){
        document.body.onclick = null;
        this.handleSubmit();
    }

    /**
     * 
     * @returns 
     */
    render(){
        let innerText = (this.state.value?.length === 0)?
            this.props.placeholder: this.state.value;

        return <span className="kt-component-renamable" onDoubleClick={this.enableEdition}>
            {!this.state.edition && innerText}
            {this.state.edition &&
                <form  className="kt-component-renamable" onSubmit={this.handleSubmit}>
                    <input ref={this.textInput} type="text" value={this.state.value} onChange={this.setValue}/>
                    {(this.props.submitLabel) &&
                         <button onClick={this.handleSubmit}>
                            {this.props.submitLabel !== "" ? 
                            this.props.submitLabel : "Submit"}</button>}
                </form>
            }
        </span>
    }
}