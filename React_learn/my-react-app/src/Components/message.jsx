// src/app/components/Message.js
"use client"
import React, { Component } from "react";

class Message extends Component {
  constructor() {
    super();
    this.state = {
      message: "Hello, welcome!",
    };
  }
//   note if you want to update with previous state always 
// use function inside setstate instead of object 
  //setState() is asynchronous and batched
  // the setstate takes one parameter and other is callback value 
  changeMessage = () => {
    this.setState({
      message: "Thank you for subscribing!",
    });//we can add callback function in setstate method as itis asynchronous in naature 
  };

//   this.setState((prevState, props) => {
//     return {
//       count: prevState.count + 1
//     };
//   });
  
  render() {
    return (
      <div>
        <h1>{this.state.message}</h1>
        <button onClick={this.changeMessage}>Subscribe</button>
      </div>
    );
  }
}

export default Message;
