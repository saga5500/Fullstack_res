import React, { useState } from 'react';

function EventLogger() {
  const [text, setText] = useState('');

  const handleChange = (e) => {
    console.log(e); // 👈 Logs the full SyntheticEvent object
    console.log(e.target); // 👈 Logs the input element
    console.log(e.target.value); // 👈 Logs the actual value the user typed

    setText(e.target.value);
  };

  return (
    <div>
      <input type="text" onChange={handleChange} />
      <p>You typed: {text}</p>
    </div>
  );
}

export default EventLogger;
