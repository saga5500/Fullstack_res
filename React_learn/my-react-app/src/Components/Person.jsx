// Now lets do refactoring 
import React from 'react'

export default function Person({person}) {
  return (
   <div>
    <h2>Name: {person.name}</h2>
    <p>Skill: {person.skill}</p>
    <p>Age: {person.age}</p>
    <p>id: {person.id}</p>
    

  </div>
  )
}
    