import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
        <div className="logo">
          <span className="logo-part blue">dev</span>
          <span className="logo-underscore">_</span>
          <span className="logo-part white">lox</span>
          <span className="logo-underscore">_</span>
          <span className="logo-part white">011</span>
        </div>
        
        <div className="menu-icon" onClick={toggleMenu}>
            <i className={isOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </div>

        <ul className={`nav-items ${isOpen ? 'active' : ''}`}>
            <li><a href="/#home" onClick={toggleMenu}>Home</a></li>
            <li><a href="/#about" onClick={toggleMenu}>About</a></li>
            <li><a href="/#portfolio" onClick={toggleMenu}>Projects</a></li>
            <li><a href="/#blog" onClick={toggleMenu}>Blog</a></li>
            <li><a href="/#contact" onClick={toggleMenu}>Contact</a></li>
        </ul>
    </nav>
  );
};

export default Navbar;
