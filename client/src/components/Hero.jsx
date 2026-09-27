import React, { useEffect, useMemo } from 'react';
import { TypeAnimation } from 'react-type-animation';
import LikeContainer from './LikeButton';
import { DirectionalLink } from './DirectionalLink';
import img from '../assets/img.jpg';
import underlineImg from '../assets/underline.jpeg';
import crimsonVideo from '../assets/crimson-moon-over-mountain.mp4';
import valleyVideo from '../assets/valley.mp4';
import SpotifyWidget from './SpotifyWidget';
import { useTheme } from '../context/ThemeContext';
import { showBanner } from './AnnouncementBanner';


const Hero = () => {
  const { theme } = useTheme();

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = img;
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  // Only resolve the video src for the active theme — unmounts the other two entirely
  const activeVideo = useMemo(() => {
    if (theme === 'light') return valleyVideo;
    return crimsonVideo;
  }, [theme]);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 md:pt-16 pb-12 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto w-full relative z-10">
        
        {/* Cinematic Video Banner */}
        <div className="w-full max-w-4xl mx-auto h-32 md:h-44 mb-6 relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, var(--color-bg-dark) 0%, transparent 40%), linear-gradient(to bottom, var(--color-bg-dark) 0%, transparent 20%), linear-gradient(to left, var(--color-bg-dark) 0%, transparent 20%), linear-gradient(to right, var(--color-bg-dark) 0%, transparent 20%)'
            }}
          ></div>
          <div className="relative w-full h-full bg-bg-dark">
            <video 
              key={theme}
              src={activeVideo} 
              autoPlay loop muted playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-90"
              style={{ objectPosition: 'center 30%' }}
            />
          </div>
        </div>

        {/* Main Content Row - Centered */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 mx-auto max-w-fit">
          
          {/* Left Column: TypeAnimation + Profile + Buttons */}
          <div className="shrink-0 flex flex-col items-center gap-2">
            
            {/* Hi, I am ... */}
            <div className="h-[32px]">
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

            {/* Profile Picture */}
            <div className="relative">
              <div className="relative w-52 h-52 md:w-60 md:h-60 rounded-2xl overflow-hidden shadow-lg bg-bg-dark">
                <img 
                  src={img} 
                  alt="Chintan" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-5 mt-3">
              <div className="relative flex flex-col items-center group "> <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="text-sm text-text-dim group-hover:text-highlight transition-colors flex items-center gap-1.5 pb-1"> <i className="fas fa-download text-xs"></i > <span className='text-text-main font-medium'>Download CV</span> </a> <img src={underlineImg} alt="underline" className="absolute -bottom-2 w-[110%] opacity-70 mix-blend-screen pointer-events-none" /> </div>
              <span className="text-border-dim">|</span>
              <button 
                                onClick={() => showBanner('Not built yet (Coming Soon!)', 'success')} 
                className="text-sm text-text-dim hover:text-highlight transition-colors flex items-center gap-1.5"
              >
                <i className="fas fa-lock text-xs"></i> <span className='text-text-main font-medium'> Private Room</span>
              </button>
               
            </div>
          <LikeContainer />
          </div>

          {/* Text Content */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left max-w-xl md:pl-8 lg:pl-12 w-full">
            
            <div className="flex items-center gap-4 mb-1"><h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-text-main to-text-dim tracking-tight">ChinTn</h1></div>
            
            {/* Spotify Bio Link */}
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <a href="https://open.spotify.com/user/133hz4l1ceg7pzx8vv6ztb4du?si=1b0d0629a93942aa" target="_blank" rel="noreferrer" title="Spotify Profile" className="group flex items-center justify-center w-8 h-8 rounded-full bg-[#1db954]/10 hover:bg-[#1db954]/20 transition-colors">
                <i className="fab fa-spotify text-[#1db954] text-lg transition-transform duration-300 group-hover:scale-110"></i>
              </a>
              <span className="text-sm text-text-dim italic tracking-wide font-light">~we might share the same vibe</span>
            </div>
            
            {/* Info (Bio & Widget) */}
            <div className="w-full flex flex-col md:flex-row items-center md:items-center justify-center md:justify-start gap-5 md:gap-8 mb-4">
              <div className="text-center md:text-left mb-2 md:mb-0">
                <div className="text-text-main font-bold text-lg mb-0.5">
                  dev_lox <span className="text-text-dim text-sm font-normal tracking-wide ml-1">/ˈtʃɪn.t̪ən/</span>
                </div>
                <div className="text-text-dim text-sm font-medium flex items-center justify-center md:justify-start gap-2">
                  <i className="fas fa-graduation-cap text-highlight/80"></i> 19M • IIT Jodhpur
                </div>
              </div>
              <div className="shrink-0 flex items-center justify-center">
                <SpotifyWidget />
              </div>
            </div>
            
            {/* Text Description */}
            <div className="text-text-dim/90 text-[15px] md:text-base leading-relaxed mb-4 max-w-lg font-light">
              <p className="mb-2 font-medium">
                Upcoming <span className="text-text-main font-medium">Elite technology Engineer Intern </span> <span className='text-highlight font-medium'>@<DirectionalLink href="https://www.accenture.com/en" target="_blank" rel="noreferrer" rest>Accenture</DirectionalLink>.</span>
              </p>
              <p className="mb-2 font-medium">
                Building <span className="text-highlight font-medium"><DirectionalLink href="https://github.com/ChinTn/Lithium-matcher" target="_blank" rel="noreferrer" rest>Lithium</DirectionalLink></span>. Learning as well as contributing <span className='text-highlight font-medium'>@<DirectionalLink href="https://github.com/ChinTn/Ripes" target="_blank" rel="noreferrer" rest>Ripes</DirectionalLink>.</span>
              </p>
              <p className="mb-2 md:text-base font-medium">
                Currently learning <span className='text-text-main '>Low latency systems & Advanced HFT Algorithms.</span>
              </p>
              <p className="font-medium tracking-wide text-sm md:text-base">
                Coding my way out of chaos • one repo at a time.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center justify-center md:justify-start gap-5 text-xl md:text-2xl text-text-dim">
              <a href="https://www.linkedin.com/in/chintan-vaghamshi-6578262aa/" target="_blank" rel="noreferrer" className="hover:text-highlight hover:scale-125 transition-all duration-300"><i className="fab fa-linkedin"></i></a>
              <a href="https://github.com/ChinTn" target="_blank" rel="noreferrer" className="hover:text-highlight hover:scale-125 transition-all duration-300"><i className="fab fa-github"></i></a>
              <a href="https://www.instagram.com/chintan_v_011/" target="_blank" rel="noreferrer" className="hover:text-highlight hover:scale-125 transition-all duration-300"><i className="fab fa-instagram"></i></a>
              <a href="https://x.com/ChinTn_011" target="_blank" rel="noreferrer" className="hover:text-highlight hover:scale-125 transition-all duration-300"><i className="fab fa-twitter"></i></a>
              <a href="https://discord.com/users/769396189572628500" target="_blank" rel="noreferrer" className="hover:text-highlight hover:scale-125 transition-all duration-300"><i className="fab fa-discord"></i></a>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;














