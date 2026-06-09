import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Projects = () => {
  const [currentProjects, setCurrentProjects] = useState([]);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    axios.get(`${API_URL}/api/projects`)
      .then(res => {
        // Filter ONLY current projects for the homepage view
        const current = res.data.filter(p => p.status === 'current');
        setCurrentProjects(current);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <section id="portfolio" className="py-24 px-6 min-h-screen border-t border-border-dim">
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-text-main mb-12 uppercase tracking-widest border-l-4 border-highlight pl-4">Currently Working</h2>
        
        {currentProjects.length === 0 ? (
          <div className="flex justify-center items-center h-48 border border-dashed border-border-main rounded-lg mb-16">
            <p className="text-text-dim text-lg font-medium">No current active projects.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 group/list">
            {currentProjects.map((proj) => (
              <div 
                key={proj._id} 
                className="group cursor-pointer flex flex-col h-full border border-border-dim bg-card-bg-light shadow-lg transition-all duration-500 relative overflow-hidden group-hover/list:opacity-60 hover:!opacity-100 hover:-translate-y-2 hover:border-highlight/50"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-highlight to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
                
                <div onClick={() => navigate(`/project/${proj._id}`)} className="cursor-pointer flex-grow flex flex-col">
                  {proj.imageUrl && (
                    <div className="w-full h-64 overflow-hidden relative border-b border-border-dim/40">
                      <img 
                        src={proj.imageUrl} 
                        alt={proj.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                      />
                      {proj.category && (
                        <div className="absolute top-4 left-4 bg-bg-dark/80 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-widest border border-border-main/30 text-text-main">
                          {proj.category}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6 md:p-8 flex flex-col flex-grow text-left">
                    <h3 className="text-2xl font-extrabold text-text-main mb-4 group-hover:text-highlight transition-colors tracking-tight">{proj.title}</h3>
                    
                    <p className="text-text-dim/90 leading-relaxed mb-6 line-clamp-3 font-medium">
                      {proj.description}
                    </p>
                  </div>
                </div>
                
                <div className="px-6 md:px-8 pb-6 md:pb-8 flex items-center gap-6 mt-auto pt-2">
                  <Link to={`/project/${proj._id}`} className="text-text-main font-bold uppercase tracking-widest text-xs hover:text-highlight transition-colors flex items-center gap-2 mr-auto group-hover:translate-x-2 duration-300">
                    Explore <i className="fas fa-arrow-right text-[10px]"></i>
                  </Link>
                  {proj.githubLink && (
                    <a href={proj.githubLink} target="_blank" rel="noreferrer" className="text-text-dim hover:text-text-main transition-colors text-xl group/icon" title="View Source on GitHub">
                      <i className="fab fa-github transition-transform duration-300 group-hover/icon:scale-125 group-hover/icon:rotate-6"></i>
                    </a>
                  )}
                  {proj.deployedLink && (
                    <a href={proj.deployedLink} target="_blank" rel="noreferrer" className="text-text-dim hover:text-text-main transition-colors text-xl group/icon" title="View Live Deployment">
                      <i className="fas fa-external-link-alt transition-transform duration-300 group-hover/icon:scale-125 group-hover/icon:-rotate-6"></i>
                    </a>
                  )}
                  {!proj.githubLink && !proj.deployedLink && proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="text-text-dim hover:text-text-main transition-colors text-xl group/icon" title="View Link">
                      <i className={`${proj.link.includes('github') ? "fab fa-github group-hover/icon:rotate-6" : "fas fa-external-link-alt group-hover/icon:-rotate-6"} transition-transform duration-300 group-hover/icon:scale-125`}></i>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Already Done Card */}
          <div 
            onClick={() => navigate('/projects/completed')}
            className="group cursor-pointer bg-card-bg-light border border-border-dim p-10 hover:border-highlight transition-all duration-300 flex flex-col items-center justify-center text-center hover:-translate-y-2 hover:shadow-glow"
          >
            <div className="w-16 h-16 rounded-full bg-bg-dark border border-border-main flex items-center justify-center text-2xl text-text-dim mb-6 group-hover:text-highlight group-hover:border-highlight transition-all">
              <i className="fas fa-check-double"></i>
            </div>
            <h3 className="text-2xl font-bold text-text-main mb-2">Already Done</h3>
            <p className="text-text-dim group-hover:text-text-main/80 transition-colors">Browse my completed projects and deployed applications.</p>
          </div>

          {/* Future Plans Card */}
          <div 
            onClick={() => navigate('/projects/future')}
            className="group cursor-pointer bg-card-bg-light border border-border-dim p-10 hover:border-highlight transition-all duration-300 flex flex-col items-center justify-center text-center hover:-translate-y-2 hover:shadow-glow"
          >
            <div className="w-16 h-16 rounded-full bg-bg-dark border border-border-main flex items-center justify-center text-2xl text-text-dim mb-6 group-hover:text-highlight group-hover:border-highlight transition-all">
              <i className="fas fa-rocket"></i>
            </div>
            <h3 className="text-2xl font-bold text-text-main mb-2">Future Planned</h3>
            <p className="text-text-dim group-hover:text-text-main/80 transition-colors">Explore concepts and ideas I'm planning to build next.</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Projects;
