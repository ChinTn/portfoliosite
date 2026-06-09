import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    window.scrollTo(0, 0);
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

  const handleBack = () => {
    if (location.state && location.state.from) {
      navigate(location.state.from);
    } else {
      navigate('/blog');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><h2 className="text-highlight text-2xl font-bold animate-pulse tracking-widest uppercase">Initializing...</h2></div>;
  if (!blog) return <div className="min-h-screen flex items-center justify-center"><h2 className="text-red-500 text-2xl font-bold tracking-widest uppercase">Data Not Found</h2></div>;

  return (
    <div className="bg-bg-dark min-h-screen">
      <Navbar />
      
      {/* Dynamic Full-Width Hero Section */}
      <div className="relative w-full min-h-[60vh] flex flex-col justify-end pb-16 px-6 pt-32 mt-[-80px]">
        {/* Background Image or Gradient */}
        {blog.imageUrl ? (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${blog.imageUrl})` }}
            ></div>
            {/* Gradient Overlays for readability and fading into content */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/80 to-transparent"></div>
            <div className="absolute inset-0 bg-black/40"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-bg-nav to-bg-dark overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-highlight via-transparent to-transparent"></div>
          </div>
        )}

        {/* Hero Content */}
        <div className="relative max-w-5xl mx-auto w-full z-10">
          <button 
            onClick={handleBack} 
            className="text-text-main/70 hover:text-highlight transition-colors mb-8 flex items-center gap-2 font-bold cursor-pointer border-none bg-transparent uppercase tracking-wider text-sm"
          >
            <i className="fas fa-arrow-left"></i> Return
          </button>
          
          <h1 className="text-5xl md:text-7xl font-black text-text-main mb-6 tracking-tight leading-tight drop-shadow-2xl">
            {blog.title}
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-highlight flex items-center justify-center text-text-main shadow-glow">
              <i className="fas fa-terminal"></i>
            </div>
            <div>
              <p className="text-highlight font-bold uppercase tracking-widest text-sm mb-1">Transmission Date</p>
              <p className="text-text-main/80 font-medium">
                {new Date(blog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-5xl mx-auto w-full px-6 py-16 md:py-24">
        {/* The cool terminal-style content wrapper without the ugly borders */}
        <div className="relative">
          {/* Subtle glowing accent line */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-highlight to-transparent opacity-50 rounded-full hidden md:block"></div>
          
          <div className="md:pl-10">
            <p className="text-text-main/90 text-lg md:text-xl leading-relaxed md:leading-loose whitespace-pre-wrap font-medium">
              {blog.content}
            </p>
          </div>
        </div>

        {/* End of Post Marker */}
        <div className="mt-24 flex items-center justify-center gap-4 opacity-50">
          <div className="w-16 h-px bg-text-dim"></div>
          <i className="fas fa-code text-text-dim"></i>
          <div className="w-16 h-px bg-text-dim"></div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
