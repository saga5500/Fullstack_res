import React from "react";

// Create context
const UserContext = React.createContext();

// Export provider and consumer
const UserProvider = UserContext.Provider;
const UserConsumer = UserContext.Consumer;

export { UserProvider, UserConsumer };  // ✅ Use named exports!
