import React from "react";
import { ButtonGroup, Button, FormCheck, FormControl, FormLabel, InputGroup, FormSelect } from "react-bootstrap";
import FormRange from "react-bootstrap/esm/FormRange";

export class SettingOption extends React.Component{
    
    /**
     * Constructor
     * @param {Object} props Component's attributes
     */
    constructor(props){
        super(props)

        this.state = {
            value: props.value
        };

        this.setValue = this.setValue.bind(this);
        this.onInput = this.onInput.bind(this);
    }

    /**
     * Set the value
     * @param {*} event 
     */
    setValue(event){
        let value = ""
        switch (this.props.type) {
            case "checkbox":
                value = event.target.checked;
                break;
        
            default:
                value = event.target ? event.target.value : event;
                break;
        }

        this.setState({ value: value });
        this.props.onChange(value);
    }

    /**
     * Action to do on input
     * @param {*} event 
     */
    onInput(event){
        if(event.target.validity.badInput){
            this.setState({
                value: this.props.value
            });
        }
    }

    onFileUpload(event,callback){
      var file = event.target.files[0]; // Get the first file selected

      var reader = new FileReader(); // Create a FileReader object
    
      reader.onload = function(e) {
        try {
          var content = JSON.parse(e.target.result);
          callback(content,e.target);
        } catch (error) {
          console.error(error,"JSON file cannot be parsed");
        }
      };
    
      reader.readAsText(file); 
    }

    render(){
        switch (this.props.type) {
            case "checkbox":
                return <div className="kt kt-component-setting-option checkbox">
                    <FormLabel htmlFor="checkbox">{this.props.children}</FormLabel>
                    <FormCheck id="checkbox" 
                               checked={this.state.value} 
                               onChange={this.setValue}
                               aria-label={this.props.children}></FormCheck>
                </div>
            case "number":
            case "duration":
                let props = {
                    value: this.state.value,
                    min: this.props.min,
                    max: this.props.max,
                    step: this.props.step,
                    onChange: this.setValue,
                    onBlur: this.onInput,
                    onInput: this.onInput
                }

                if(this.props.disabled){
                    props = Object.assign(props,{disabled:true})
                }
                return <div className="kt kt-component-setting-option number">
                    <FormLabel htmlFor="number">{this.props.children}</FormLabel>
                    <FormControl id="number" type="number" {...props}
                        aria-label={this.props.children}
                        required></FormControl>
                    {this.props.type == "duration" &&
                        <FormSelect aria-label="Default select example">
                            <option value="86400000">day(s)</option>
                            <option value="604800000">week(s)</option>
                            <option value="18748800000">month(s)</option>
                        </FormSelect>
                    }
                </div>
            case "options":
                let btnList = this.props.options.map((item)=>
                    <Button key={item.value} 
                        variant={item.value == this.state.value ? "primary": "outline-primary"}
                        onClick={()=>{this.setValue(item.value)}}
                    >{item.name}</Button>
                )
                return <div className="kt kt-component-setting-option options">
                    <FormLabel>{this.props.children}</FormLabel>
                    <ButtonGroup aria-label="Basic example">
                        {btnList}
                       {/*  <Button id="left" variant="primary">Left</Button>
                        <Button id="middle" variant="outline-primary">Middle</Button>
                        <Button id="right" variant="outline-primary">Right</Button> */}
                    </ButtonGroup>
                </div>
                case "upload":
                    return <div>
                        <FormLabel>{this.props.children}</FormLabel>
                        <FormControl type="file" accept=".json" 
                            onChange={(event)=>{this.onFileUpload(event,this.props.onUpload);}}
                        ></FormControl>
                    </div>
            default:
                return <InputGroup className="kt kt-component-setting-option">
                                            <FormLabel>{this.props.children}</FormLabel>
                        <FormControl type="text" 
                            onChange={(event)=>{this.onFileUpload(event,this.props.onUpload);}}
                        ></FormControl>
                </InputGroup>
        }
    }
}