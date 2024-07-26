import React from "react";
import './Navbar.css';


function Navbar() {

  return (
  <div>
    <body>
    <header>
      <div className="navbar">
      <div  className="logo"><a href="/">Etic PLUS</a></div>
      <ul className="links">
          <li><a href="/profile">Profile</a></li>
        </ul>
        
        
        <a href="/login" className="action-btn" >Login</a>
      </div>
  
    </header>
    </body>
    </div>
  );
}

export default Navbar;