"use client"
import React, { Component } from "react";

class Message extends Component {
  constructor() {
    super();
    this.state = {
      message: 0, // ✅ number not string
    };
  }

  // ✅ Functional setState for proper updates
//   we can use destructuring probs with {} destructuring keyword 
  changeMessage = () => {
    // if you are using functional setstate then you have to use prevState
    // if you want previous stste then always use function inside setstate insted of object
    // The brackets {} inside an arrow function mean an object is being returned.
    this.setState(prevState => ({
      message: prevState.message + 1
    }), () => {
      console.log(this.state.message);
    });
  };

  increamentfive = () => {
    this.changeMessage();
    this.changeMessage();
    this.changeMessage();
    this.changeMessage();
    this.changeMessage();
  }

  render() {
    return (
      <div>
        <h1>{this.state.message}</h1>
        <button onClick={this.increamentfive}>Subscribe</button>
      </div>
    );
  }
}

export default Message;
