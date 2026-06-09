import React from 'react';
import videoSrc from '../assets/profile.mp4';
import { useTheme } from '../context/ThemeContext';

const About = () => {
  const { cycleTheme } = useTheme();
  const skills = [
    'C', 'C++', 'HTML', 'CSS', 'Javascript', 'React', 'Node.js', 
    'Express.js', 'MongoDB', 'Postman', 'Tailwind', 'Python', 
    'Numpy', 'Pandas', 'NETWORKX', 'GIT', 'GIT HUB'
  ];

  return (
    <section id="about" className="py-24 px-6 min-h-screen flex items-center border-t border-border-main">
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-text-main mt-8 mb-8 uppercase tracking-widest border-l-4 border-highlight pl-4">About Me</h2>

        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Left Text & Skills */}
          <div className="w-full md:w-7/12">
            <div className="text-text-dim text-lg leading-relaxed mb-6">
              <p>I’m a third-year BTech student at IIT Jodhpur with a deep passion for problem-solving and software development. I thrive on building things from scratch and understanding how systems work under the hood. While I've explored creative fields like cinematography and graphic design—which honed my eye for visual detail—my true focus is writing clean, solid code.</p>
              <div className="h-3"></div>
              <p>Currently, I'm focused on mastering full-stack development, contributing to open source, and strengthening my fundamentals. When I'm not coding, you can find me resetting by playing football or strumming my guitar. I'm always learning and building—one repo at a time.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-text-main mb-4 uppercase tracking-wider">Skills & Tech</h3>
              <div className="flex flex-wrap gap-3">
                {skills.map(skill => (
                  <span 
                    key={skill} 
                    className="px-4 py-2 bg-card-bg-light border border-border-main text-text-dim rounded-md text-sm font-medium hover:border-highlight hover:text-text-main transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-5/12 flex justify-center md:justify-end">
            <div className="relative group">
              {/* Red Accent Background with Text */}
              <div className="absolute inset-0 bg-video-bg transform translate-x-4 translate-y-4 rounded-lg transition-all duration-500 group-hover:translate-x-6 group-hover:translate-y-10 flex flex-col justify-end items-end p-2 pr-4 overflow-hidden">
                <span className="text-black font-black italic text-xl tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  TrY MEEE!!
                </span>
              </div>
              
              <video 
                src={videoSrc} 
                autoPlay 
                loop 
                muted 
                playsInline
                onClick={cycleTheme}
                className="relative z-10 w-full max-w-[350px] aspect-[4/5] object-cover border border-border-main grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
