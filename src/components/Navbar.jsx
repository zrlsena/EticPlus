import React from "react";
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const isSignInPage = location.pathname === '/signin'; // veya başka bir sayfa kontrolü

  return (
    <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
        <img style={{ marginLeft:'20px', width: '60px' }} className="rounded-pill" src="/images/eticLogo.png" alt="Etic PLUS Logo" />
        </a>

        <ul class="navbar-nav">
        <li class="nav-item">
        <a class="nav-link" href="/profile">Profile</a>
      </li>
      <li class="nav-item">
      <a class="nav-link" href="/login" >Login</a>
      </li>

        </ul>
       
      </div>
    </nav>
  );
}

export default Navbar;
