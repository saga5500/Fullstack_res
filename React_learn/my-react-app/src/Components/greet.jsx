import React from "react";


//one drawback of props are as follows that they are immutable cannot be changed
export default function Greet({name,heroname}){
    return <h1>Hello World  {name} and {heroname}</h1>
}