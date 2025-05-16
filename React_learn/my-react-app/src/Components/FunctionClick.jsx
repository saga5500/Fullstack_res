"use client"
import React from 'react'

export default function FunctionClick() {
    function Clickhandler(){
        console.log("button Clicked");
    }
  return (
    <div>

    <button onClick={Clickhandler}>function button</button>
    </div>
  )
}
