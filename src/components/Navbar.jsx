import React from "react";
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const isSignInPage = location.pathname === '/signup';

  return (
    <header className={isSignInPage ? 'navbar-signin' : 'navbar'}>
      <div className="logo">
        <Link to="/">
          <img src="/images/eticLogo.png" alt="Etic PLUS Logo" />
        </Link>
      </div>

      {!isSignInPage && (
        <ul className="links">
          <li><a href="/profile">Profile</a></li>
        </ul>
      )}

      {!isSignInPage && (
        <a href="/login" className="action-btn">Login</a>
      )}
    </header>
  );
}

export default Navbar;
