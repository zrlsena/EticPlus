import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-sm bg-light navbar-light fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/home">
          <img
            style={{ marginLeft: '20px', width: '100px' }}
            className="rounded-pill"
            src="/images/blueLogo.png"
            alt="Etic PLUS Logo"
          />
        </Link>

        <ul className="navbar-nav">
          {location.pathname == '/home' && (
            <li className="nav-item">
              <Link className="nav-link" to="/profile">Profile</Link>
            </li>
          )}
          
          {location.pathname === '/profile' && (
            <li className="nav-item">
              <Link className="nav-link" to="/home">Home</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;