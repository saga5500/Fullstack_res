import React, { useState } from 'react';

export default function HookCounterTwo() {
    const first = 0;
    const [count, setCount] = useState(first); // Fixed typo: setCount

    const increment5 = () => {
        setCount(previous => previous + 5); // Increment by 5 using state update pattern
    }

    return (
        <div>
            <button onClick={() => setCount(count + 1)}>Increment {count}</button> 
            <button onClick={() => setCount(count - 1)}>Decrement {count}</button> 
            <button onClick={increment5}>Increment 5 {count}</button> {/* Fixed button logic */}
        </div>
    );
}
