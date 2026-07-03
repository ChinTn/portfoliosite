import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import themeSong from '../assets/song_of_ice_and_fire.webm';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState({ location: '', temperature: '' });
  const location = useLocation();
  const toggleMenu = () => setIsOpen(!isOpen);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    // Attempt to autoplay the theme song on load
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        // Browsers often block autoplay without prior user interaction
        console.log("Autoplay blocked by browser. User interaction required.");
      });
    }

    // Fallback: Start playing on the very first click/tap anywhere on the page if autoplay was blocked
    const handleFirstInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(e => console.error("Audio play failed:", e));
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    axios.get(`${API_URL}/api/settings`)
      .then(res => {
        if (res.data) setSettings(res.data);
      })
      .catch(err => console.error(err));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'The Heir', path: '/about' },
    { name: 'Conquests', path: '/projects' },
    { name: 'Scrolls', path: '/blog' },
    { name: 'Ravens', path: '/contact' },
  ];

  const handleNavClick = (e, path) => {
    if (location.pathname === path) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 pointer-events-none ${
      scrolled 
        ? 'bg-gradient-to-b from-bg-nav via-bg-nav/80 to-transparent pb-8 pt-3' 
        : 'bg-transparent pt-3'
    }`}>
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center relative pointer-events-auto">
        
        {/* Logo */}
        <Link to="/" onClick={(e) => handleNavClick(e, '/')} className="text-3xl md:text-4xl font-extrabold tracking-tighter group flex items-center">
          <span className="text-highlight transition-all duration-300 group-hover:pr-1">dev</span>
          <span className="text-text-dim transition-all duration-300 group-hover:text-transparent group-hover:opacity-0 relative">
            _<span className="absolute inset-0 opacity-0 group-hover:opacity-100 text-transparent"> </span>
          </span>
          <span className="text-text-main transition-all duration-300 group-hover:px-1">lox</span>
          <span className="text-text-dim transition-all duration-300 group-hover:text-transparent group-hover:opacity-0 relative">
            _<span className="absolute inset-0 opacity-0 group-hover:opacity-100 text-transparent"> </span>
          </span>
          <span className="text-text-main transition-all duration-300 group-hover:pl-1">011</span>
        </Link>

        {/* Location & Temp (Desktop Only) */}
        {settings.location && (
          <div className="hidden lg:flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-highlight cursor-default relative">
              <i className="fas fa-map-marker-alt"></i>
              <span>{settings.location}</span>
              <span className="text-text-dim/50 px-1 font-light">|</span>
              <span>{settings.temperature}</span>
          </div>
        )}

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={togglePlay} 
            className="text-highlight hover:text-text-main transition-colors flex items-center gap-2 text-sm font-bold tracking-widest uppercase"
            title="Play Theme"
          >
            <img 
              src="/targaryen_sigil.png" 
              alt="Targaryen Sigil" 
              className={`w-6 h-6 object-contain filter invert opacity-80 hover:opacity-100 transition-opacity ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}
            />
          </button>
          
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              onClick={(e) => handleNavClick(e, link.path)}
              className="relative text-text-dim hover:text-highlight text-sm md:text-base font-bold transition-colors group py-2"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-highlight transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-text-dim hover:text-highlight text-3xl focus:outline-none transition-colors"
          onClick={toggleMenu}
        >
          <i className={isOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden absolute top-24 left-0 w-full bg-bg-nav border-b border-border-dim shadow-2xl pointer-events-auto transition-all duration-300 ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
        <div className="flex flex-col py-6 px-8 gap-6">
          <button 
            onClick={togglePlay} 
            className="text-highlight hover:text-text-main transition-colors flex items-center gap-4 text-xl font-bold tracking-widest uppercase self-start"
          >
            <img 
              src="/targaryen_sigil.png" 
              alt="Targaryen Sigil" 
              className={`w-8 h-8 object-contain filter invert opacity-80 transition-opacity ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}
            />
            {isPlaying ? 'Pause Theme' : 'Play Theme'}
          </button>
          
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              onClick={(e) => handleNavClick(e, link.path)}
              className="text-text-dim hover:text-highlight text-xl font-bold transition-all hover:translate-x-2"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Audio Element */}
      <audio ref={audioRef} src={themeSong} loop autoPlay />
    </nav>
  );
};

export default Navbar;
