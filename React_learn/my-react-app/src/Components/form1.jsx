import React, { Component } from 'react'

export default class Form extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: ""
    }

    this.usernameHandle = this.usernameHandle.bind(this)
  }

  usernameHandle(event) {
    this.setState({
      username: event.target.value
    })
  }

  render() {
    return (
      <div>
        <form>
          <label>UserName: </label>
          <input
            type="text"
            value={this.state.username}
            onChange={this.usernameHandle}
          />
          <p>You typed: {this.state.username}</p>
        </form>
      </div>
    )
  }
}
