import React, { Component } from 'react'

export default class LifecycleB extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         name:"sagar"
      }
      console.log("LifecycleB constructor")
    }
    static getDerivedFromProps(props,state){
        console.log("LifecycleB getDerivedFromProps")
        return null
    }
    
    componentDidMount(){
        console.log("LifecycleB componentDidMount")
    }
  render() {
    console.log("LifecycleB render") // ✅ This is correct
    return (
      <div>LifecycleB rendering
     

      </div>
    )
  }
}
