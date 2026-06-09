import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Blogs = () => {
  const [blogs, setBlogs] = useState(() => {
    const saved = sessionStorage.getItem('portfolioBlogs');
    return saved ? JSON.parse(saved) : [];
  });
  const [page, setPage] = useState(() => {
    const savedPage = sessionStorage.getItem('portfolioBlogsPage');
    return savedPage ? parseInt(savedPage, 10) : 0;
  });
  const itemsPerPage = 2;
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    sessionStorage.setItem('portfolioBlogsPage', page);
  }, [page]);

  useEffect(() => {
    axios.get(`${API_URL}/api/blogs`)
      .then(res => {
        setBlogs(res.data);
        sessionStorage.setItem('portfolioBlogs', JSON.stringify(res.data));
      })
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
    <section id="blog" className="py-24 px-6 min-h-screen border-t border-border-main">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-text-main mt-10 mb-12 uppercase tracking-widest border-l-4 border-highlight pl-4">Blogs</h2>
        
        {blogs.length === 0 ? (
          <div className="flex justify-center items-center h-48 border border-dashed border-border-main">
            <p className="text-text-dim text-lg font-medium">Will get updated Soon...!</p>
          </div>
        ) : (
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                {currentBlogs.map((blog) => (
                  <div 
                    key={blog._id} 
                    onClick={() => navigate(`/blog/${blog._id}`)}
                    className="cursor-pointer group flex flex-col mb-12 pb-12 border-b border-border-dim/30 last:border-0 last:mb-0 last:pb-0"
                  >
                    {blog.imageUrl && (
                      <div className="overflow-hidden mb-8 relative">
                        <img 
                          src={blog.imageUrl} 
                          alt={blog.title} 
                          className="w-full h-64 md:h-[400px] object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-105 transition-all duration-700 ease-in-out" 
                        />
                        {/* Subtle color tint overlay that disappears on hover */}
                        <div className="absolute inset-0 bg-highlight/10 group-hover:bg-transparent transition-all duration-700 pointer-events-none"></div>
                      </div>
                    )}
                    
                    <h3 className="text-3xl md:text-4xl font-extrabold text-text-main mb-4 group-hover:text-highlight transition-colors tracking-tight">
                      {blog.title}
                    </h3>
                    
                    <p className="text-text-dim/90 text-lg leading-relaxed mb-6 line-clamp-3 font-medium">
                      {blog.content}
                    </p>
                    
                    <div className="mt-auto">
                      <span className="text-highlight font-bold uppercase tracking-widest text-sm flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                        Read Transmission <i className="fas fa-arrow-right text-xs"></i>
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-12 pb-12">
                <button 
                  onClick={handlePrev} 
                  disabled={page === 0} 
                  className={`px-4 py-2 border text-sm font-medium flex items-center gap-2 transition-all ${page === 0 ? 'border-border-main text-text-main/30 cursor-not-allowed' : 'border-highlight text-highlight hover:bg-highlight hover:text-text-main'}`}
                >
                  <i className="fas fa-chevron-left text-xs"></i> Prev
                </button>
                <span className="text-text-dim text-sm font-medium">{page + 1} / {totalPages}</span>
                <button 
                  onClick={handleNext} 
                  disabled={page === totalPages - 1} 
                  className={`px-4 py-2 border text-sm font-medium flex items-center gap-2 transition-all ${page === totalPages - 1 ? 'border-border-main text-text-main/30 cursor-not-allowed' : 'border-highlight text-highlight hover:bg-highlight hover:text-text-main'}`}
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

export default Blogs;
