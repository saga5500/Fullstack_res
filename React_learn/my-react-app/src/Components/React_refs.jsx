import React, { Component, createRef } from 'react';

class React_refs extends Component {
  constructor() {
    super();
    this.inputRef = createRef(); // Step 1: Create ref
  }

  componentDidMount() {
    this.inputRef.current.focus(); // Step 3: Use ref to focus input
  }

  render() {
    return (
      <div>
        <h3>Auto focus input using Ref</h3>
        <input ref={this.inputRef} type="text" placeholder="Type here..." />
      </div>
    );
  }
}

export default React_refs;
