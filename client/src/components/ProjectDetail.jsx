import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    axios.get(`${API_URL}/api/projects/${id}`)
      .then(res => {
        setProject(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleBack = () => {
    if (location.state && location.state.from) {
      navigate(location.state.from);
    } else {
      navigate('/projects');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><h2 className="text-highlight text-2xl font-bold animate-pulse">Loading...</h2></div>;
  if (!project) return <div className="min-h-screen flex items-center justify-center"><h2 className="text-red-500 text-2xl font-bold">Project not found</h2></div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto w-full">
          <button onClick={handleBack} className="text-text-dim hover:text-text-main transition-colors mb-10 flex items-center gap-2 font-medium cursor-pointer border-none bg-transparent">
            <i className="fas fa-arrow-left text-sm"></i> Back to Projects
          </button>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-main mb-10 tracking-tight">{project.title}</h1>
          
          <div className="bg-card-bg-light border border-border-dim p-8 md:p-12">
            <p className="text-text-dim text-lg leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-4 mt-10">
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 border border-border-dim bg-bg-nav hover:bg-card-bg text-text-main font-medium transition-all hover:-translate-y-1 group">
                  <i className="fab fa-github text-lg transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6"></i> GitHub Repository
                </a>
              )}
              {project.deployedLink && (
                <a href={project.deployedLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-highlight hover:bg-highlight/90 text-text-main font-medium transition-all hover:-translate-y-1 group">
                  <i className="fas fa-external-link-alt text-sm transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6"></i> Visit Site
                </a>
              )}
              {project.link && !project.deployedLink && !project.githubLink && (
                <a href={project.link} target="_blank" rel="noreferrer" className={`${project.link.includes('github') ? "border border-border-dim bg-bg-nav hover:bg-card-bg" : "bg-highlight hover:bg-highlight/90"} inline-flex items-center gap-2 px-6 py-3 text-text-main font-medium transition-all hover:-translate-y-1 group`}>
                  <i className={`${project.link.includes('github') ? "fab fa-github text-lg group-hover:rotate-6" : "fas fa-external-link-alt text-sm group-hover:-rotate-6"} transition-transform duration-300 group-hover:scale-125`}></i> {project.link.includes('github') ? 'GitHub Repository' : 'Visit Project'}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetail;
