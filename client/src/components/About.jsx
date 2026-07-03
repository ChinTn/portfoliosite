import React from 'react';
import profilePic from '../assets/queen and dragon.jpg';
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
        <h2 className="text-3xl font-bold text-text-main mt-8 mb-8 uppercase tracking-widest border-l-4 border-highlight pl-4">Queen Rhaenyra's Heir</h2>

        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Left Text & Skills */}
          <div className="w-full md:w-7/12">
            <div className="text-text-dim text-lg leading-relaxed mb-6">
              <p>I am a third-year scholar of BTech at the Citadel of IIT Jodhpur, possessing a deep fire for solving complex riddles and forging software. I thrive on constructing new realms from the ground up and uncovering the hidden mechanisms that govern them. Though I have wandered through the creative arts of cinematography and design—which sharpened my dragon’s eye for visual perfection—my true calling lies in forging clean, impenetrable code.</p>
              <div className="h-3"></div>
              <p>At present, my banners are raised toward mastering the full-stack arts, lending my sword to the open-source realm, and fortifying my foundational defenses. When the battles of logic cease, you might find me honing my agility on the football field or strumming the strings of my lute. I am forever expanding my empire and building my legacy—one conquest at a time.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-text-main mb-4 uppercase tracking-wider">Dragon Arsenal</h3>
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
          <div className="w-full md:w-5/12 flex flex-col items-center md:items-end">
            <div className="relative group inline-block">
              {/* Anime Dialogue Bubble (Hover Effect) */}
              <div className="absolute top-8 -left-8 md:-left-20 z-30 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 group-hover:-translate-x-2 transition-all duration-300 pointer-events-none flex flex-col items-end scale-90 group-hover:scale-100 origin-bottom-right drop-shadow-2xl">
                <div className="bg-white/5 backdrop-blur-md text-text-main font-bold px-4 py-2 border border-border-main rounded-tl-xl rounded-tr-xl rounded-bl-xl shadow-lg relative">
                  <div className="flex flex-col items-center gap-1">
                    <span className="italic tracking-wider text-xs md:text-sm uppercase whitespace-nowrap">"Lykiri"</span>
                    <span className="italic tracking-wider text-[10px] md:text-xs uppercase whitespace-nowrap text-text-dim">
                      Arliniagon ... <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500">Change</span>
                    </span>
                  </div>
                </div>
                {/* Tail pointing at the character */}
                <div className="w-0 h-0 border-t-[12px] border-t-border-main border-l-[16px] border-l-transparent mr-2 opacity-50"></div>
              </div>

              {/* Accent Background */}
              <div className="absolute inset-0 bg-video-bg transform translate-x-4 translate-y-4 transition-all duration-500 group-hover:translate-x-2 group-hover:translate-y-2"></div>
              
              <img 
                src={profilePic} 
                alt="Profile"
                onClick={cycleTheme}
                className="relative z-10 w-full max-w-[350px] aspect-[4/5] object-cover border border-border-main grayscale group-hover:grayscale-0 transition-all duration-500 cursor-pointer"
              />
            </div>
            
            <p className="text-text-dim/60 text-xs italic font-medium hover:text-text-main transition-colors mt-6 md:mr-4">
              ~the colors inspired from xevrion.dev
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
