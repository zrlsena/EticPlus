import React from "react";

function Navbar() {

  return (
    <nav className="navbar navbar-expand-sm bg-light navbar-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/home">
        <img style={{ marginLeft:'20px', width: '80px' }} className="rounded-pill" src="/images/blueLogo.png" alt="Etic PLUS Logo" />
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
