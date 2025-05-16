import React from 'react';
import Person from './Person.jsx';

export default function NameList() {
  const name1 = [
    { name: "sagar", skill: "React", id: 1, age: 22 },
    { name: "sumit", skill: "Java", id: 2, age: 23 },
    { name: "sachin", skill: "Python", id: 3, age: 24 },
    { name: "shubham", skill: "C++", id: 4, age: 25 }
  ];

  // Pass each person object as a prop to the Person component
  const newnames = name1.map((person) => (
    // The key is the reserved word in react as it is used to identify 
    // the element in the list otherwise it throws errors in console
    // we always give unique id wjile processing the list in React 


    // if there is nounique key then we use index parameter in map method as use as unique queue
    <Person key={person.id} person={person} />
  ));

  return <div>{newnames}</div>;
}
