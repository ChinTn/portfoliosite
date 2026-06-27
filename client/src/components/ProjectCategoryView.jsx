import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';

const ProjectCategoryView = () => {
  const { status } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(0);
  const itemsPerPage = 4; // Show more items on the dedicated page

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Reset page when category changes
    setPage(0);
    
    const cached = sessionStorage.getItem('projectsCache');
    if (cached) {
      const data = JSON.parse(cached);
      setProjects(data.filter(p => p.status === status));
    }
    
    // Always fetch in background to keep cache fresh
    axios.get(`${API_URL}/api/projects`)
      .then(res => {
        sessionStorage.setItem('projectsCache', JSON.stringify(res.data));
        setProjects(res.data.filter(p => p.status === status));
      })
      .catch(err => console.error(err));
  }, [status]);

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  
  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const currentProjects = projects.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const getTitle = () => {
    if (status === 'completed') return 'Already Done';
    if (status === 'future') return 'Future Plans';
    if (status === 'current') return 'Currently Working';
    return 'Projects';
  };

  return (
    <section className="py-32 px-6 min-h-screen">
      <div className="max-w-5xl mx-auto w-full">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-16 border-b border-border-dim pb-6">
          <button onClick={() => navigate('/projects')} className="text-text-dim hover:text-highlight transition-colors flex items-center gap-2 font-medium cursor-pointer bg-transparent border-none">
            <i className="fas fa-arrow-left"></i> Back
          </button>
          <h2 className="text-3xl font-bold text-highlight uppercase tracking-widest">{getTitle()}</h2>
        </div>
        
        {projects.length === 0 ? (
          <div className="flex justify-center items-center h-64 border border-dashed border-border-main rounded-lg">
            <p className="text-text-dim text-lg font-medium">No projects found in this category.</p>
          </div>
        ) : (
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {currentProjects.map((proj) => (
                  <div 
                    key={proj._id} 
                    className="bg-card-bg-light border border-border-dim p-8 hover:border-highlight/50 transition-colors flex flex-col group h-full"
                  >
                    <div onClick={() => navigate(`/project/${proj._id}`)} className="cursor-pointer flex-grow">
                      <h3 className="text-2xl font-bold text-highlight mb-3 group-hover:text-text-main transition-colors">{proj.title}</h3>
                      
                      {proj.category && (
                         <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-wider rounded bg-card-bg-light text-text-dim">
                           {proj.category}
                         </span>
                      )}

                      {proj.imageUrl && (
                        <img 
                          src={proj.imageUrl} 
                          alt={proj.title} 
                          className="w-full h-48 object-cover mb-6 border-2 border-border-main group-hover:border-highlight group-hover:opacity-90 transition-all duration-300" 
                        />
                      )}

                      <p className="text-text-dim leading-relaxed mb-6 line-clamp-3">
                        {proj.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-6 mt-auto pt-6 border-t border-border-dim/50">
                      <Link to={`/project/${proj._id}`} className="text-text-main font-medium hover:text-highlight transition-colors flex items-center gap-2 text-sm mr-auto">
                        Read More <i className="fas fa-arrow-right text-xs"></i>
                      </Link>
                      
                      {proj.githubLink && (
                        <a href={proj.githubLink} target="_blank" rel="noreferrer" className="text-text-dim hover:text-highlight transition-colors text-xl group/icon" title="View Source on GitHub">
                          <i className="fab fa-github transition-transform duration-300 group-hover/icon:scale-125 group-hover/icon:rotate-6"></i>
                        </a>
                      )}
                      
                      {proj.deployedLink && (
                        <a href={proj.deployedLink} target="_blank" rel="noreferrer" className="text-text-dim hover:text-highlight transition-colors text-xl group/icon" title="View Live Deployment">
                          <i className="fas fa-external-link-alt transition-transform duration-300 group-hover/icon:scale-125 group-hover/icon:-rotate-6"></i>
                        </a>
                      )}
                      
                      {!proj.githubLink && !proj.deployedLink && proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer" className="text-text-dim hover:text-highlight transition-colors text-xl group/icon" title="View Link">
                          <i className={`${proj.link.includes('github') ? "fab fa-github group-hover/icon:rotate-6" : "fas fa-external-link-alt group-hover/icon:-rotate-6"} transition-transform duration-300 group-hover/icon:scale-125`}></i>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-16">
                <button 
                  onClick={handlePrev} 
                  disabled={page === 0} 
                  className={`px-4 py-2 border rounded-md text-sm font-medium flex items-center gap-2 transition-all ${page === 0 ? 'border-border-dim text-text-dim/30 cursor-not-allowed' : 'border-highlight text-highlight hover:bg-highlight hover:text-text-main'}`}
                >
                  <i className="fas fa-chevron-left text-xs"></i> Prev
                </button>
                <span className="text-text-dim text-sm font-medium">{page + 1} / {totalPages}</span>
                <button 
                  onClick={handleNext} 
                  disabled={page === totalPages - 1} 
                  className={`px-4 py-2 border rounded-md text-sm font-medium flex items-center gap-2 transition-all ${page === totalPages - 1 ? 'border-border-dim text-text-dim/30 cursor-not-allowed' : 'border-highlight text-highlight hover:bg-highlight hover:text-text-main'}`}
                >
                  Next <i className="fas fa-chevron-right text-xs"></i>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectCategoryView;
