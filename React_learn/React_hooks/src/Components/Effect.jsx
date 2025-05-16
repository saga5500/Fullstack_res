import React, { useState, useEffect } from 'react';

export default function Effect() {
    const [count, setCount] = useState(0);



    // The useeffect is called every time the component is rendered.
    useEffect(() => {
        document.title = `You clicked ${count} times`;

    }, [count]); // Optional: Only run when count changes

    return (
        <div>
            <button onClick={() => setCount(count + 1)}>
                Click {count}
            </button>
        </div>
    );
}
