"use client"
import React, { Component } from 'react';

export default class ClassClick extends Component {
  // Arrow function syntax allows us to avoid binding
  Clickhandler = () => {
    console.log("Class button clicked");
  };

  render() {
    return (
      <div>
        <button onClick={this.Clickhandler}>Class button</button>
      </div>
    );
  }
}
