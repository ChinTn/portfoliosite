import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
        <div className="logo">
          <Link to="/" style={{ textDecoration: 'none' }} onClick={() => setIsOpen(false)}>
            <span className="logo-part blue">dev</span>
            <span className="logo-underscore">_</span>
            <span className="logo-part white">lox</span>
            <span className="logo-underscore">_</span>
            <span className="logo-part white">011</span>
          </Link>
        </div>
        
        <div className="menu-icon" onClick={toggleMenu}>
            <i className={isOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </div>

        <ul className={`nav-items ${isOpen ? 'active' : ''}`}>
            <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
            <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
            <li><Link to="/projects" onClick={toggleMenu}>Projects</Link></li>
            <li><Link to="/blog" onClick={toggleMenu}>Blog</Link></li>
            <li><Link to="/contact" onClick={toggleMenu}>Contact</Link></li>
        </ul>
    </nav>
  );
};

export default Navbar;
