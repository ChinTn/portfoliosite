import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(0);
  const itemsPerPage = 2;

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    axios.get(`${API_URL}/api/blogs`)
      .then(res => setBlogs(res.data))
      .catch(err => console.error(err));
  }, []);

  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  
  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const currentBlogs = blogs.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <section id="blog" className="section" style={{ overflow: 'hidden' }}>
        <h1 className="section-title">Blogs</h1>
        
        {blogs.length === 0 ? (
          <p style={{ color: "rgba(253, 237, 217, 0.599)", display: "flex", justifyContent: "center", fontWeight: "500", fontSize: "25px" }}>
              Will get updated Soon...!
          </p>
        ) : (
          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                {currentBlogs.map((blog) => (
                  <div key={blog._id} style={{ 
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0))', 
                    backdropFilter: 'blur(20px)', 
                    WebkitBackdropFilter: 'blur(20px)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                    borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRight: '1px solid rgba(255, 255, 255, 0.02)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
                    padding: '25px', 
                    borderRadius: '16px', 
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.05)' 
                  }}>
                    {blog.imageUrl && (
                      <img src={blog.imageUrl} alt={blog.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }} />
                    )}
                    <h3 style={{ color: '#2196f3', marginBottom: '10px', fontSize: '22px' }}>{blog.title}</h3>
                    <p style={{ 
                      color: 'rgba(253, 237, 217, 0.768)', 
                      display: '-webkit-box', 
                      WebkitLineClamp: 3, 
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden',
                      lineHeight: '1.6',
                      margin: 0
                    }}>
                      {blog.content}
                    </p>
                    <div style={{ marginTop: '15px' }}>
                      <Link to={`/blog/${blog._id}`} style={{ color: '#2196f3', textDecoration: 'none', fontWeight: 'bold' }}>Read More →</Link>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px', paddingBottom: '60px' }}>
                <button onClick={handlePrev} disabled={page === 0} style={{...navBtnStyle, opacity: page === 0 ? 0.5 : 1}}>
                  <i className="fas fa-chevron-left"></i> Prev
                </button>
                <span style={{ color: '#888', alignSelf: 'center' }}>{page + 1} / {totalPages}</span>
                <button onClick={handleNext} disabled={page === totalPages - 1} style={{...navBtnStyle, opacity: page === totalPages - 1 ? 0.5 : 1}}>
                  Next <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </div>
        )}
    </section>
  );
};

const navBtnStyle = {
  background: 'transparent',
  border: '1px solid #2196f3',
  color: '#2196f3',
  padding: '8px 16px',
  borderRadius: '20px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'all 0.3s'
};

export default Blogs;
