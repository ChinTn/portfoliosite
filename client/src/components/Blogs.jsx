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
      className="bg-card-bg-light border border-border-dim/50 overflow-hidden cursor-pointer group shadow-xl transition-all duration-300 flex flex-col md:flex-row h-auto md:h-[240px]"
    >
      {blog.imageUrl && (
        <div className="overflow-hidden relative h-48 md:h-auto md:w-2/5 shrink-0">
          <img 
            src={blog.imageUrl} 
            alt={blog.title} 
            className="w-full h-full object-cover transition-opacity duration-500" 
          />
          <div className="absolute inset-0 bg-highlight/5 group-hover:bg-transparent transition-colors duration-700 pointer-events-none"></div>
        </div>
      )}
      
      <div className="p-6 md:p-8 flex flex-col flex-grow relative z-10 md:w-3/5">
        <h3 className="text-2xl md:text-3xl font-extrabold text-text-main mb-3 group-hover:text-highlight transition-colors tracking-tight">
          {blog.title}
        </h3>
        
        <div className="flex-grow mb-6">
          <p className="text-text-dim text-base leading-relaxed line-clamp-3 font-medium group-hover:text-text-main transition-colors duration-300">
            {stripMarkdown(blog.content)}
          </p>
        </div>
        
        <div className="mt-auto pt-4 border-t border-border-dim/50">
          <span className="text-highlight font-bold uppercase tracking-widest text-sm flex items-center gap-2 group-hover:text-white transition-colors duration-300">
            Dive <i className="fas fa-arrow-right text-[10px]"></i>
          </span>
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
    <section id="blog" className="bg-bg-dark relative z-10 border-t border-border-main py-24 px-6">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center md:text-left mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-main uppercase tracking-widest border-l-4 border-highlight pl-6 inline-block">
            Blogs
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
