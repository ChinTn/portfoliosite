import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Projects = () => {
  const [currentProjects, setCurrentProjects] = useState([]);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const cached = sessionStorage.getItem('projectsCache');
    if (cached) {
      const data = JSON.parse(cached);
      setCurrentProjects(data.filter(p => p.status === 'current'));
    }
    
    // Always fetch in background to keep cache fresh
    axios.get(`${API_URL}/api/projects`)
      .then(res => {
        sessionStorage.setItem('projectsCache', JSON.stringify(res.data));
        setCurrentProjects(res.data.filter(p => p.status === 'current'));
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <section id="portfolio" className="py-24 px-6 min-h-screen border-t border-border-dim">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12 border-b border-border-dim/50 pb-4">
          <h2 className="text-base md:text-lg font-bold text-text-main uppercase tracking-[0.3em] flex items-center gap-3">
            <i className="fas fa-terminal text-highlight drop-shadow-[0_0_8px_var(--theme-highlight)] animate-[pulse_3s_ease-in-out_infinite]"></i> CURRENT PROJECTS ({currentProjects.length})
          </h2>
        </div>
        
        {currentProjects.length === 0 ? (
          <div className="flex justify-center items-center h-48 border border-dashed border-border-main rounded-lg mb-16">
            <p className="text-text-dim text-lg font-medium">No current active projects.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 group/list">
            {currentProjects.map((proj) => (
              <div 
                key={proj._id} 
                className="group flex flex-col h-full border-2 border-border-dim bg-transparent rounded-lg transition-colors duration-300 relative overflow-hidden hover:border-border-main"
              >
                <div onClick={() => navigate(`/project/${proj._id}`)} className="cursor-pointer flex-grow flex flex-col">
                  {proj.imageUrl && (
                    <div className="w-full h-48 md:h-56 overflow-hidden relative border-b border-border-dim/20">
                      <img 
                        src={proj.imageUrl} 
                        alt={proj.title} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" 
                      />
                      {proj.category && (
                        <div className="absolute top-4 left-4 bg-bg-dark/80 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-widest border border-border-main/30 text-text-main">
                          {proj.category}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-grow text-left">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-text-main group-hover:text-highlight transition-colors">
                        {proj.title}
                      </h3>
                      <div className="flex gap-3 text-text-dim text-sm pt-1">
                        {proj.githubLink && (
                          <a href={proj.githubLink} target="_blank" rel="noreferrer" className="hover:text-text-main transition-colors" title="View Source on GitHub">
                            <i className="fab fa-github"></i>
                          </a>
                        )}
                        {proj.deployedLink && (
                          <a href={proj.deployedLink} target="_blank" rel="noreferrer" className="hover:text-text-main transition-colors" title="View Live Deployment">
                            <i className="fas fa-external-link-alt"></i>
                          </a>
                        )}
                        {!proj.githubLink && !proj.deployedLink && proj.link && (
                          <a href={proj.link} target="_blank" rel="noreferrer" className="hover:text-text-main transition-colors" title="View Link">
                            <i className="fas fa-external-link-alt"></i>
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-text-dim text-sm leading-relaxed mb-6 line-clamp-3">
                      {proj.description}
                    </p>
                  </div>
                </div>
                
                <div className="px-6 pb-6 flex items-center justify-between mt-auto">
                  <div className="flex flex-wrap gap-2 text-[11px] text-text-dim w-full font-medium">
                    <span className="border border-border-dim/40 rounded px-2 py-1 bg-card-bg-light/20">{proj.category || 'Project'}</span>
                    <span className="border border-border-dim/40 rounded px-2 py-1 bg-card-bg-light/20">{proj.status === 'current' ? 'Active' : 'Completed'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Already Done Card */}
          <div 
            onClick={() => navigate('/projects/completed')}
            className="group cursor-pointer bg-transparent border-2 border-border-dim p-10 hover:border-border-main transition-colors duration-300 flex flex-col items-center justify-center text-center rounded-lg"
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
            className="group cursor-pointer bg-transparent border-2 border-border-dim p-10 hover:border-border-main transition-colors duration-300 flex flex-col items-center justify-center text-center rounded-lg"
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
