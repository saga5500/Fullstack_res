import React, { Component } from 'react'

export default class UserGreeting2 extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
        isLoggedIn: true
      }
    }
  render() {

    // let message;this is uding rendering variable 
    if(this.state.isLoggedIn){
        message=<div>user is Logged</div>
    }
    else{
        message=<div>user is not Logged</div>
    }
    return (
      <div>{message}</div>
    )
  }
  // this is using conditionall rendering 
  // isLoggedIn ? <div>user is Logged</div> : <div>user is not Logged</div>
}
