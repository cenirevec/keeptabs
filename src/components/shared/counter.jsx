import React from "react";
import Button from 'react-bootstrap/Button';

export class Counter extends React.Component{
        /**
     * Constructor
     * @param {Object} props Component's attributes
     */
    constructor(props){
        super(props);
        this.state = {
            value: this.props.value
        };

        this.increase = this.increase.bind(this)
        this.decrease = this.decrease.bind(this)
    }

    increase(){
        this.setState({
            value: parseInt(this.state.value) + 1
        });
    }

    decrease(){
        this.setState({
            value: this.state.value - 1
        });
    }

    /**
     * React rendering function
     * @returns Rendered content
     */
    render(){
        return <div className="kt kt-counter">
            <h2>Voici un compteur</h2>
            <Button onClick={this.decrease} variant="primary">-</Button>
            <span>{this.state.value}</span>
            <Button onClick={this.increase} variant="success">+</Button>

        </div>
    }
}
