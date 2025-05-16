import React, { Component } from 'react'
import LifecycleB from './LifecycleB';
export default class LifecycleA extends Component {
    constructor(props) {
      super(props)
      this.state = {
         name: "sagar"
      }
      console.log("LifecycleA constructor");
    }

    static getDerivedStateFromProps(props, state) {
        console.log("LifecycleA getDerivedStateFromProps");
        return null;
    }

    componentDidMount() {
        console.log("LifecycleA componentDidMount");
    }

    render() {
        console.log("LifecycleA render"); // ✅ This is correct
        return (
            <div>LifecycleA rendering
               <LifecycleB/>
            </div>
        )
           
    }
}
