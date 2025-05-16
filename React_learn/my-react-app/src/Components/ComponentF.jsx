// ComponentF.jsx
import React from "react";
import { UserConsumer } from "./userContext";

function ComponentF() {
  return (
    <UserConsumer>
      {(username) => (
        <div>
          <h1>Component F</h1>
          <h2>{username}</h2>
        </div>
      )}
    </UserConsumer>
  );
}

export default ComponentF;
