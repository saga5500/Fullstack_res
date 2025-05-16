import React, { Component } from 'react'

export default class Fragments extends Component {
  render() {

    // <></> in here there is no key component 
    return (
     <React.Fragment>
        <td>Name</td>

        <td>Age</td>

     </React.Fragment>
    )
  }
}
