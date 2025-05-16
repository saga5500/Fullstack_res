import { Link,Outlet } from 'react-router-dom';

function Navbar() {
  return (
    <div>

    <nav>
        {/* insted of using Link we can also use NavLink also for active Link */}
        {/* we use LInk instead of a tag like html */}
      <Link to="/">Home</Link> |
      <Link to="/about">About</Link>
      <Link to="/products">Products</Link>
    </nav>  
    <Outlet />
    </div>
  );
}

export default Navbar;
