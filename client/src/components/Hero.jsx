import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import img from '../assets/img.jpg';
import imgEvil from '../assets/img-evil.jpg';
import SpotifyWidget from './SpotifyWidget';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

let hasPlayedIntroGlobal = false;

const Hero = () => {
  const { theme } = useTheme();
  
  // Capture the value once on mount so re-renders don't cancel the animation
  const [shouldPlayIntro] = React.useState(!hasPlayedIntroGlobal);

  useEffect(() => {
    // Preload the evil image so it's instantly available on theme switch
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imgEvil;
    document.head.appendChild(link);
    
    // Mark intro as played so it doesn't replay when navigating back
    hasPlayedIntroGlobal = true;
  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-24 pb-12 px-6 relative overflow-hidden">
      
      {/* SVG Filter for Jagged/Torn Edge */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <filter id="jagged-edge" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="80" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Cinematic Intro Effects (Mask Reveal) - Only play once per session! */}
      {shouldPlayIntro && (
        <div className="fixed inset-0 z-[101] pointer-events-none overflow-hidden">
          
          {/* Absolute Blackout Overlay to hide pre-animation SVG glitches */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 1.4, duration: 0 }}
            className="absolute inset-0 bg-bg-dark z-[150]"
          />

          {/* The Expanding Mask Hole with Jagged Edge */}
          <motion.div
            initial={{ 
              width: 0, 
              height: 0, 
              borderWidth: '0px',
              borderRadius: '50%',
              opacity: 1
            }}
            animate={{ 
              width: '350vw', // Extra large to clear corners after displacement
              height: '350vw', 
              borderWidth: ['80px', '30px', '2px'], // Thicker border to show the jaggedness
              borderRadius: '50%', // The SVG filter handles the organic distortion now
            }}
            transition={{ 
              delay: 1.4, 
              duration: 2.5, 
              ease: "easeOut",
            }}
            style={{
              boxShadow: '0 0 0 4000px var(--theme-bg-dark), inset 0 0 60px currentColor',
              filter: 'url(#jagged-edge)'
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-highlight text-highlight z-40"
          />
        </div>
      )}

      <motion.div 
        initial={!shouldPlayIntro ? { scale: 1, filter: 'brightness(1) blur(0px)' } : { scale: 1.1, filter: 'brightness(2) blur(10px)' }}
        animate={{ scale: 1, filter: 'brightness(1) blur(0px)' }}
        transition={!shouldPlayIntro ? { duration: 0 } : { duration: 2, ease: "easeOut", delay: 1.4 }}
        className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center md:items-center justify-between gap-12 md:gap-16 relative z-10"
      >
        
        {/* Left Side: Image & Spotify */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
          <div className="relative group mb-8">
            {/* Glowing effect behind the image */}
            <div className="absolute inset-0 bg-highlight/20 blur-3xl rounded-full scale-100 group-hover:bg-highlight/40 group-hover:scale-125 transition-all duration-700 will-change-transform transform-gpu translate-z-0"></div>
            
            <img 
              src={theme === 'evil' ? imgEvil : img} 
              alt="Chintan" 
              className="hero-image relative w-72 h-72 md:w-[380px] md:h-[380px] object-cover rounded-full border-4 border-border-main group-hover:border-highlight shadow-xl group-hover:shadow-glow transition-all duration-500 z-10"
            />
          </div>
          <div className="w-full max-w-[320px] flex justify-center mt-2">
            <SpotifyWidget />
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="h-[32px] mb-2">
            <div className="text-highlight font-semibold tracking-wider uppercase flex items-center gap-2">
              <span>Hi, I am</span>
              <span className="text-text-main">
                <TypeAnimation
                  sequence={[
                    'CHINTAN', 2000,
                    'A DEVELOPER', 2000,
                    'A STUDENT', 2000
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-text-main mb-4 tracking-tight">ChinTn</h1>
          
          {/* Spotify Bio Link */}
          <div className="flex items-center gap-3 mb-6">
            <a href="https://open.spotify.com/user/133hz4l1ceg7pzx8vv6ztb4du?si=1b0d0629a93942aa" target="_blank" rel="noreferrer" title="Spotify Profile" className="group">
              <i className="fab fa-spotify text-highlight text-xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12"></i>
            </a>
            <span className="text-sm text-text-dim italic tracking-wide">~we might share the same Vibe</span>
          </div>
          
          <div className="text-text-dim text-base leading-relaxed mb-8 max-w-lg">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div>
                <span className="text-text-main font-medium">dev_lox /ˈtʃɪn.t̪ən/.</span><br />
                19M • IIT Jodhpur.
              </div>
              <button 
                onClick={() => toast('Not built yet 🚧 (Coming Soon!)', { icon: '🔒' })} 
                className="px-5 py-2 bg-card-bg/50 text-text-dim text-sm font-bold rounded hover:text-highlight border border-border-dim border-dashed transition-all hover:scale-105 flex items-center gap-2 ml-auto md:ml-4"
              >
                <i className="fas fa-lock text-sm"></i> Private Room
              </button>
            </div>
            <p>
              Obsessed with logic, edge cases, and how things work.<br />
              Currently in Development. Have explored Data Science & Open Source.<br />
              Not tied to a single domain.<br />
              Learning by building, breaking, and fixing.<br /><br />
              <span className="text-highlight">Coding my way out of chaos • one repo at a time.</span>
            </p>
          </div>
          
          {/* Buttons */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-highlight text-white font-medium rounded-md hover:bg-opacity-90 transition-colors text-sm md:text-base">
              Download CV
            </a>
            <Link to="/contact" className="px-6 py-2.5 bg-card-bg text-text-main font-medium rounded-md hover:bg-card-bg-light border border-border-dim transition-colors text-sm md:text-base">
              Contact
            </Link>
          </div>
          
          {/* Social Links */}
          <div className="flex gap-6 text-2xl md:text-3xl text-text-dim mt-2">
            <a href="https://www.linkedin.com/in/chintan-vaghamshi-6578262aa/" target="_blank" rel="noreferrer" className="hover:text-highlight hover:scale-125 transition-all duration-300"><i className="fab fa-linkedin"></i></a>
            <a href="https://github.com/ChinTn" target="_blank" rel="noreferrer" className="hover:text-highlight hover:scale-125 transition-all duration-300"><i className="fab fa-github"></i></a>
            <a href="https://www.instagram.com/chintan_v_011/" target="_blank" rel="noreferrer" className="hover:text-highlight hover:scale-125 transition-all duration-300"><i className="fab fa-instagram"></i></a>
            <a href="https://x.com/ChinTn_011" target="_blank" rel="noreferrer" className="hover:text-highlight hover:scale-125 transition-all duration-300"><i className="fab fa-twitter"></i></a>
            <a href="https://discord.com/users/769396189572628500" target="_blank" rel="noreferrer" className="hover:text-highlight hover:scale-125 transition-all duration-300"><i className="fab fa-discord"></i></a>
          </div>
        </div>
        
      </motion.div>
    </section>
  );
};

export default Hero;
