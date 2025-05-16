import React, { Component } from 'react';

export default class Lifecycle_unmountingA extends Component {
  constructor(props) {
    super(props);

    // Step 1: Initialize state
    this.state = {
      count: 0
    };

    // This runs first when component is created
    console.log("1. Constructor");
  }

  // Step 2: Called before every render (initial + update)
  // Used to update state based on new props (not needed here, so we return null)
  static getDerivedStateFromProps(props, state) {
    console.log("2. getDerivedStateFromProps");
    return null; // no change to state
  }

  // Step 3: Decide whether to allow re-render
  // Here we always return true to allow update
  shouldComponentUpdate(nextProps, nextState) {
    console.log("3. shouldComponentUpdate");
    return true;
  }

  // Step 4: Runs **just before** the changes are made to the DOM
  // Used to capture scroll position or other values
  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log("4. getSnapshotBeforeUpdate");
    return "Snapshot data"; // passing some snapshot to componentDidUpdate
  }

  // Step 5: Runs **after** the update is done
  // Good place to make API calls or update the DOM
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("5. componentDidUpdate");
    console.log("Snapshot was:", snapshot); // logs snapshot returned from previous step
  }

  // Step 6: Called just before the component is removed from the DOM (unmounting)
  componentWillUnmount() {
    console.log("6. componentWillUnmount - Component is being removed from the DOM");
    // Clean up any resources, like timers or subscriptions, if needed
  }

  // Button click handler – updates the state (count)
  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
  }

  // Step 7: Renders the JSX to the screen
  render() {
    console.log("7. render");
    return (
      <div>
        <h2>Count: {this.state.count}</h2>
        <button onClick={this.handleClick}>Increase</button>
      </div>
    );
  }
}
