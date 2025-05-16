import React, { useState } from "react";
export default function HookCounter() {
    // The useState  takes a default value and have a second arguments as a changing state function 

    // The useState returns an array with two elements, the current state and a function to update it
    //This is array destructuring with an object 
    const [count, setCount] = useState(0);
    return (
        <div>
            <button onClick={() => { setCount(count + 1) }}>Count{count }</button>
        </div>
    )
}
