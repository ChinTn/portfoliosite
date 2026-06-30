import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ReactLenis } from 'lenis/react';

const stripMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/^#+\s+/gm, '') // Remove headings
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Extract link text
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Extract bold text
    .replace(/(\*|_)(.*?)\1/g, '$2') // Extract italic text
    .replace(/`([^`]+)`/g, '$1') // Extract inline code
    .replace(/\n+/g, ' ') // Replace newlines with space
    .trim();
};

const BlogCard = ({ blog, navigate, i }) => {
  return (
    <div 
      onClick={() => navigate(`/blog/${blog._id}`)}
      className="bg-transparent border-2 border-border-dim rounded-lg overflow-hidden cursor-pointer group transition-colors duration-300 flex flex-col md:flex-row h-auto md:h-[240px] hover:border-border-main"
    >
      {blog.imageUrl && (
        <div className="overflow-hidden relative h-48 md:h-auto md:w-2/5 shrink-0 border-b md:border-b-0 md:border-r border-border-dim/20">
          <img 
            src={blog.imageUrl} 
            alt={blog.title} 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" 
          />
        </div>
      )}
      
      <div className="p-4 md:px-6 md:py-5 flex flex-col flex-grow relative z-10 md:w-3/5">
        <h3 className="text-xl font-bold text-text-main mb-2 group-hover:text-highlight transition-colors">
          {blog.title}
        </h3>
        
        <div className="flex-grow mb-6">
          <p className="text-text-dim text-sm leading-relaxed line-clamp-3">
            {stripMarkdown(blog.content)}
          </p>
        </div>
        
        <div className="mt-auto pt-4 border-t border-border-dim/20 flex items-center justify-between">
          <div className="flex flex-wrap gap-2 text-[11px] text-text-dim w-full font-medium">
            <span className="border border-border-dim/40 rounded px-2 py-1 bg-card-bg-light/20">Article</span>
            <span className="border border-border-dim/40 rounded px-2 py-1 bg-card-bg-light/20">Read <i className="fas fa-arrow-right ml-1 text-[9px]"></i></span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Blogs = () => {
  const [blogs, setBlogs] = useState(() => {
    const saved = sessionStorage.getItem('portfolioBlogs');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 4;

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    axios.get(`${API_URL}/api/blogs`)
      .then(res => {
        setBlogs(res.data);
        sessionStorage.setItem('portfolioBlogs', JSON.stringify(res.data));
      })
      .catch(err => console.error(err));
  }, [API_URL]);

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Smooth scroll back to the top of the blogs section when page changes
    const section = document.getElementById('blog');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="blog" className="relative z-10 border-t border-border-main py-24 px-6">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12 border-b border-border-dim/50 pb-4 text-left">
          <h2 className="text-base md:text-lg font-bold text-text-main uppercase tracking-[0.2em] flex items-center gap-3">
            <i className="fas fa-layer-group text-highlight drop-shadow-[0_0_8px_var(--theme-highlight)] animate-[pulse_3s_ease-in-out_infinite]"></i> BLOGS ({blogs.length})
          </h2>
        </div>

        {blogs.length === 0 ? (
          <div className="flex justify-center items-center h-48 w-full border border-dashed border-border-main rounded-xl">
            <p className="text-text-dim text-lg font-medium">Will get updated Soon...!</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-8">
              {currentBlogs.map((blog, i) => (
                <BlogCard 
                  key={blog._id} 
                  blog={blog} 
                  i={i} 
                  navigate={navigate}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-16">
                <button 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-12 h-12 rounded-full border border-border-dim text-text-dim flex items-center justify-center hover:text-highlight hover:border-highlight disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center transition-all cursor-pointer ${
                        currentPage === i + 1 
                          ? 'bg-highlight text-white shadow-glow border-transparent' 
                          : 'border border-border-dim text-text-dim hover:border-highlight hover:text-highlight'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="w-12 h-12 rounded-full border border-border-dim text-text-dim flex items-center justify-center hover:text-highlight hover:border-highlight disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Blogs;
