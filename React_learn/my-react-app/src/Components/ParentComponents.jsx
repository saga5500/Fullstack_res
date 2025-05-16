import React, { Component } from 'react'
import ChildComponent from './ChildComponent'
export class ParentComponents extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         parentName:"Parent"
      }
      this.greetParent=this.greetParent.bind(this);
    }
    greetParent(child){
        alert(`Hello  ${this.state.parentName} and nextname is ${child}`)
    }
  render() {
    return (
      <div>
        <div>Parent Components</div>
        {/* method as a prop */}
        <ChildComponent greetHandler={this.greetParent}/>
      </div>
    )
  }
}

export default ParentComponents