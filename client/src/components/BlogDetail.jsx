import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeRaw from 'rehype-raw';
import GithubSlugger from 'github-slugger';
import 'highlight.js/styles/atom-one-dark.css';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  
  const observer = useRef(null);

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

  useEffect(() => {
    if (blog && blog.content) {
      const slugger = new GithubSlugger();
      const headingLines = blog.content.match(/^#{1,4}\s+(.*)/gm) || [];
      const extractedHeadings = headingLines.map(line => {
        const level = line.match(/^#+/)[0].length;
        const text = line.replace(/^#+\s+/, '');
        const id = slugger.slug(text);
        return { level, text, id };
      });
      setHeadings(extractedHeadings);
    }
  }, [blog]);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = Array.from(document.querySelectorAll('h1, h2, h3, h4'))
        .filter(el => el.id);
      
      let currentActiveId = '';
      for (const el of headingElements) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 100) {
          currentActiveId = el.id;
        } else {
          break;
        }
      }
      
      if (!currentActiveId && headingElements.length > 0) {
        currentActiveId = headingElements[0].id; // highlight first if at top
      }
      
      setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll);
    setTimeout(handleScroll, 100); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings, loading]);

  const handleBack = () => {
    if (location.state && location.state.from) {
      navigate(location.state.from);
    } else {
      navigate('/blog');
    }
  };

  const handleTocClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><h2 className="text-highlight text-2xl font-bold animate-pulse tracking-widest uppercase">Initializing...</h2></div>;
  if (!blog) return <div className="min-h-screen flex items-center justify-center"><h2 className="text-red-500 text-2xl font-bold tracking-widest uppercase">Data Not Found</h2></div>;

  return (
    <div className="bg-bg-dark min-h-screen">
      <Navbar />
      
      {/* Dynamic Full-Width Hero Section */}
      <div className="relative w-full flex flex-col justify-end pt-40 md:pt-48 pb-16 px-6 mt-[-80px] border-b border-border-dim">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-nav/30 to-bg-dark overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-highlight via-transparent to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto w-full z-10">
          <div className="max-w-4xl">
            <button 
              onClick={handleBack} 
              className="text-text-main/70 hover:text-highlight transition-colors mb-4 flex items-center gap-2 font-bold cursor-pointer border-none bg-transparent uppercase tracking-wider text-sm"
            >
              <i className="fas fa-arrow-left"></i> Return
            </button>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-main mb-3 tracking-tight leading-tight">
              {blog.title}
            </h1>
            
            <p className="text-text-main/70 text-lg mb-4">
              {blog.description || 'Everything I learned building and publishing this project, mistakes included.'}
            </p>
            
            <div className="flex items-center gap-4 text-sm font-medium text-text-dim">
              <span className="text-text-main/90">
                {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span>&middot;</span>
              <span>{Math.max(1, Math.ceil(blog.content?.length / 1000))} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Sidebar Layout */}
      <div className="max-w-7xl mx-auto w-full px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16 relative">
        
        {/* Left: Markdown Content */}
        <div className="min-w-0 pb-24">
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeSlug, rehypeRaw]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-12 mb-6 text-text-main" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-10 mb-4 text-text-main border-b border-border-dim pb-2" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-8 mb-4 text-text-main" {...props} />,
                p: ({node, ...props}) => <p className="text-text-main/80 leading-relaxed mb-6 text-lg" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 text-text-main/80 space-y-2 text-lg" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6 text-text-main/80 space-y-2 text-lg" {...props} />,
                a: ({node, ...props}) => <a className="text-highlight hover:underline font-medium" {...props} />,
                code: ({node, className, children, ...props}) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const isBlock = match || (className && className.includes('hljs')) || String(children).includes('\n');
                  return isBlock ? (
                    <div className="relative rounded-lg overflow-hidden my-6 border border-border-dim bg-[#282c34]">
                      {match && match[1] && (
                        <div className="absolute top-0 right-0 px-3 py-1 text-xs text-text-dim uppercase tracking-wider bg-black/40 rounded-bl-md">
                          {match[1]}
                        </div>
                      )}
                      <div className="overflow-x-auto p-4">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </div>
                    </div>
                  ) : (
                    <code className="bg-highlight/20 text-highlight rounded px-1.5 py-0.5 text-sm font-mono" {...props}>
                      {children}
                    </code>
                  )
                },
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-highlight pl-4 italic text-text-main/70 my-6 bg-highlight/5 py-2 rounded-r" {...props} />
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Right: Sticky Table of Contents */}
        <aside className="hidden lg:block relative">
          <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-text-dim mb-6">On This Page</h4>
            <nav className="space-y-1 relative border-l border-border-dim">
              {headings.length > 0 ? headings.map((heading, index) => (
                <a
                  key={index}
                  href={`#${heading.id}`}
                  onClick={(e) => handleTocClick(e, heading.id)}
                  className={`block py-1.5 pr-2 transition-colors duration-200 text-sm ${
                    activeId === heading.id 
                      ? 'text-highlight font-medium border-l-2 border-highlight -ml-[1px] pl-3' 
                      : 'text-text-main/60 hover:text-text-main pl-3'
                  }`}
                  style={{ paddingLeft: `${(heading.level - 1) * 12 + 12}px` }}
                >
                  {heading.text}
                </a>
              )) : (
                <p className="text-sm text-text-dim pl-3">No headings found.</p>
              )}
            </nav>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default BlogDetail;
