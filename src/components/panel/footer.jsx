import React, {Component} from "react";

export class FooterPanel extends Component{  
    /**
     * React rendering function
     * @returns Rendered content
     */
    render(){
        return <section className="kt kt-panel kt-panel-footer">
             KeepTabs is an
                <a href="https://github.com/cenirevec/keeptabs">
                    open source project on Apache Licence
                </a> 
        </section>
    }
}