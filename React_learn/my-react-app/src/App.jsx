import React from "react";
import './App.css';
import ParentComponents from "./Components/ParentComponents";
// Make sure the folder name and file names are case-sensitive!
import Greet from './Components/greet.jsx';
import FunctionClick from './Components/FunctionClick.jsx';
import Message from './Components/message.jsx';
import Hello from './Components/hello.jsx';
import Welcome from './Components/Welcome.jsx';
import ClassClick from './Components/ClassClick.jsx';
import Setstate from './Components/Setstate.jsx';
// import UserGreeting from "./Components/UserGreeting.jsx";
import UserGreeting2 from "./Components/UserGreeting2.jsx";
import NameList from "./Components/NameList.jsx";
import Stylesheet from "./Components/Stylesheet.jsx";
import Inline from "./Components/Inline.jsx";
import Styles from "./Components/appstyles.module.css";
import Form from "./Components/form1.jsx";
import LifecycleA from "./Components/LifecycleA.jsx";
import Lifecycle_updatingA from "./Components/Lifecycle_updatingA.jsx";
import Lifecycle_unmountingA from './Components/Lifecycle_unmountingA.jsx';
import React_refs from "./Components/React_refs.jsx";
import {UserProvider} from "./Components/userContext.jsx";
import ComponentC from "./Components/ComponentC.jsx";
function App() {
  return (
    <div>
      {/* <h1 className={Styles.sucess  }>The prompt is sucess</h1> */}
      {/* <h1 className={Styles.error}>The prompt is error</h1> */}
      {/* <Setstate/>
     <ParentComponents/>
     {/* <UserGreeting/> */}
      {/* <UserGreeting2/> */}
      {/* <NameList/>
      */}
      {/* <Stylesheet/> */}
      {/* <Inline/> */}
      {/* <inline/> */}
      {/* <Form/> */}
      {/* <LifecycleA/> */}
      {/* <Lifecycle_updatingA/> */}
      {/* <Lifecycle_unmountingA/> */}
      {/* <React_refs/> */}

      {/* This USerProvider should be placed where the all the decendent compoennets could take the values nested inside */}
      <UserProvider value="Sagar from App">
        <ComponentC />
      </UserProvider> 
    </div>
  );
}

export default App;
