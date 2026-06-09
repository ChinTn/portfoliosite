import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Blogs from './components/Blogs';
import GithubActivity from './components/GithubActivity';
import GithubRepos from './components/GithubRepos';
import Contact from './components/Contact';
import CustomCursor from './components/CustomCursor';

// Code Splitting for heavy or non-initial routes
const Admin = React.lazy(() => import('./components/Admin'));
const ProjectDetail = React.lazy(() => import('./components/ProjectDetail'));
const ProjectCategoryView = React.lazy(() => import('./components/ProjectCategoryView'));
const BlogDetail = React.lazy(() => import('./components/BlogDetail'));

const Home = () => {
  const navType = useNavigationType();

  React.useLayoutEffect(() => {
    if (navType === 'POP') {
      const savedScroll = sessionStorage.getItem('homeScrollPosition');
      if (savedScroll) {
        // Force instant scroll to avoid CSS smooth scroll sweeping across the page
        window.scrollTo({ top: parseInt(savedScroll, 10), left: 0, behavior: 'instant' });
      }
    }

    let timeoutId;
    const handleScroll = () => {
      // debounce to avoid performance issues
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        sessionStorage.setItem('homeScrollPosition', window.scrollY);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [navType]);

  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Blogs />
      <GithubActivity />
      <GithubRepos />
    </>
  );
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

const ScrollToTop = () => {
  const location = useLocation();
  const navType = useNavigationType();
  
  useEffect(() => {
    if (navType !== 'POP') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location, navType]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      <CustomCursor />
      {!isAdminRoute && <Navbar />}
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
          <Route path="/blog" element={<PageTransition><Blogs /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/project/:id" element={<PageTransition><React.Suspense fallback={<div className="min-h-screen"></div>}><ProjectDetail /></React.Suspense></PageTransition>} />
          <Route path="/projects/:status" element={<PageTransition><React.Suspense fallback={<div className="min-h-screen"></div>}><ProjectCategoryView /></React.Suspense></PageTransition>} />
          <Route path="/blog/:id" element={<PageTransition><React.Suspense fallback={<div className="min-h-screen"></div>}><BlogDetail /></React.Suspense></PageTransition>} />
          
          <Route path="/admin" element={<PageTransition><React.Suspense fallback={<div className="min-h-screen"></div>}><Admin /></React.Suspense></PageTransition>} />
        </Routes>
      </AnimatePresence>

      {/* Hide the global contact footer if we are already explicitly on the /contact page or admin page */}
      {!isAdminRoute && location.pathname !== '/contact' && <Contact />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
