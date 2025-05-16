import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from "./Components/Home"
import About from "./Components/About"
import './App.css'
import { Routes, Route } from "react-router-dom"
import Navbar from './Components/Navbar.jsx'
import Products from './Components/Products.jsx'
import New from './Components/New.jsx'
import Featured from './Components/Featured.jsx'
function App() {


  return (
    <>
      {/* importing navbar */}
      <Navbar />
      <Routes>
        {/* defining the routes */}
        {/* The route method acts as a routing path  */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} >
          <Route path='featured' element={<Featured/>} />
          <Route path='new' element={<New />} />
        </Route>
        {/* Nested Routes */}
      </Routes>
    </>
  )
}

export default App
