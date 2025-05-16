import React from 'react'

function ChildComponent(props) {
  return (
    <div>
      {/* The arrows function waits for a user to click for a event */}
        <button onClick={()=>props.greetHandler("child")}>greet component </button>
    </div>
  )
}

export default ChildComponent