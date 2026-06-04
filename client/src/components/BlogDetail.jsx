import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    axios.get(`${API_URL}/api/blogs/${id}`)
      .then(res => {
        setBlog(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={pageStyle}><h2 style={{color: '#2196f3'}}>Loading...</h2></div>;
  if (!blog) return <div style={pageStyle}><h2 style={{color: '#c41e3a'}}>Blog not found</h2></div>;

  return (
    <>
      <Navbar />
      <div style={pageStyle}>
        <div style={containerStyle}>
          <Link to="/#blog" style={backBtnStyle}><i className="fas fa-arrow-left"></i> Back to Blogs</Link>
          
          {blog.imageUrl && (
            <img src={blog.imageUrl} alt={blog.title} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '16px', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
          )}

          <h1 style={{ color: '#2196f3', fontSize: '40px', marginBottom: '20px' }}>{blog.title}</h1>
          <p style={{ color: '#888', marginBottom: '30px' }}>
            Published on {new Date(blog.createdAt).toLocaleDateString()}
          </p>
          
          <div style={cardStyle}>
            <p style={{ color: 'rgba(253, 237, 217, 0.9)', fontSize: '18px', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
              {blog.content}
            </p>
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

export default BlogDetail;
