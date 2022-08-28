import React from "react";
import { createRoot } from "react-dom/client";

class Counter extends React.Component{
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
            value: this.state.value + 1
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
        return <div>
            <h2>Voici un compteur</h2>
            <button onClick={this.increase}>+</button>
            <span>{this.state.value}</span>
            <button onClick={this.decrease}>-</button>
        </div>
    }
}

function Home(){
    return(
        <div>
            <h1>Salut, jeune entrepreneur !</h1>
            <p>Il s'agit d'une simple page</p>
            <Counter value="5"/>
            <Counter value="15"/>
        </div>
    )
}



//render(<Home/>, document.getElementById("react-target"));
const root = createRoot(document.getElementById("react-target"));
root.render(<Home />);