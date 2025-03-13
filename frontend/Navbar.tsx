
import React from 'react';
import { useAuth } from "./context/AuthProvider";

const Navbar = () => {
    const { user, logout } = useAuth();
  
    return (
      <nav>
        <h2>My App</h2>
        {user ? (
          <>
            <span>Welcome, {user.username}!</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <a href="/login">Login</a>
        )}
      </nav>
    );
  };

  export default Navbar;

  