import React from 'react'
import {Link,Outlet} from "react-router-dom";
export default function Products() {
  return (
    <div>
        <input type="search" placeholder='Search Products' />

        <nav>
            <Link to="featured">Featured</Link>
            <Link to="new">New</Link>
        </nav>
        {/* The react router does not know where to print the the compoennet
        The Outlet acts as a place holder for the nested routing componenets */}
        <Outlet />
        {/* The Outlet will be replaced by the nested routing component */}
    </div>
  )
}
