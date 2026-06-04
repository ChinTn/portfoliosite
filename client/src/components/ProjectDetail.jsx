import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const ProjectDetail = () => {
  const { id } = useParams();
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

  if (loading) return <div style={pageStyle}><h2 style={{color: '#2196f3'}}>Loading...</h2></div>;
  if (!project) return <div style={pageStyle}><h2 style={{color: '#c41e3a'}}>Project not found</h2></div>;

  return (
    <>
      <Navbar />
      <div style={pageStyle}>
        <div style={containerStyle}>
          <Link to="/#portfolio" style={backBtnStyle}><i className="fas fa-arrow-left"></i> Back to Projects</Link>
          <h1 style={{ color: '#2196f3', fontSize: '40px', marginBottom: '20px' }}>{project.title}</h1>
          
          <div style={cardStyle}>
            <p style={{ color: 'rgba(253, 237, 217, 0.9)', fontSize: '18px', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
              {project.description}
            </p>
            
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer" style={linkBtnStyle}>
                Visit Project <i className="fas fa-external-link-alt"></i>
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const pageStyle = { minHeight: '100vh', background: '#1a1a1a' };
const containerStyle = { maxWidth: '800px', margin: '0 auto', padding: '180px 20px 50px 20px' };
const backBtnStyle = { display: 'inline-block', marginBottom: '30px', color: '#888', textDecoration: 'none', fontSize: '16px', transition: 'color 0.2s' };
const cardStyle = {
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0))', 
  backdropFilter: 'blur(20px)', 
  WebkitBackdropFilter: 'blur(20px)',
  borderTop: '1px solid rgba(255, 255, 255, 0.2)',
  borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
  borderRight: '1px solid rgba(255, 255, 255, 0.02)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
  padding: '40px', 
  borderRadius: '20px', 
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.05)'
};
const linkBtnStyle = {
  display: 'inline-block', marginTop: '30px', padding: '12px 24px', background: '#2196f3', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold'
};

export default ProjectDetail;
