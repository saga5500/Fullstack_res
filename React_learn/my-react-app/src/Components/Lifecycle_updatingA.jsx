import React, { Component } from 'react';

export default class Lifecycle_updatingA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
    console.log("1. Constructor");
  }

  static getDerivedStateFromProps(props, state) {
    console.log("2. getDerivedStateFromProps");
    return null; // we are not updating state from props here
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("3. shouldComponentUpdate");
    return true; // allow re-render
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log("4. getSnapshotBeforeUpdate");
    return "Snapshot data";
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("5. componentDidUpdate");
    console.log("Snapshot was:", snapshot);
  }

  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    console.log("6. render");
    return (
      <div>
        <h2>Count: {this.state.count}</h2>
        <button onClick={this.handleClick}>Increase</button>
      </div>
    );
  }
}
