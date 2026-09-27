import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { GlobalBanner } from './components/AnnouncementBanner';


import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Blogs from './components/Blogs';
import GithubActivity from './components/GithubActivity';
import GithubRepos from './components/GithubRepos';
import Contact from './components/Contact';
import CustomCursor from './components/CustomCursor';
import Guestbook from './components/Guestbook';

// Code Splitting for heavy or non-initial routes
const Admin = React.lazy(() => import('./components/Admin'));
const ProjectDetail = React.lazy(() => import('./components/ProjectDetail'));
const ProjectCategoryView = React.lazy(() => import('./components/ProjectCategoryView'));
const BlogDetail = React.lazy(() => import('./components/BlogDetail'));

const Home = () => {
  const navType = useNavigationType();
  const [mountRest, setMountRest] = React.useState(false);

  React.useLayoutEffect(() => {
    // Only attempt scroll restoration after below-the-fold content has mounted
    if (navType === 'POP' && mountRest) {
      const savedScroll = sessionStorage.getItem('homeScrollPosition');
      if (savedScroll) {
        // Small delay to let the DOM settle after mounting deferred sections
        requestAnimationFrame(() => {
          window.scrollTo({ top: parseInt(savedScroll, 10), behavior: 'instant' });
        });
      }
    }

    let timeoutId;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        sessionStorage.setItem('homeScrollPosition', window.scrollY);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [navType, mountRest]);

  useEffect(() => {
    // Defer rendering heavy below-the-fold components to allow Hero to paint instantly
    const timer = setTimeout(() => setMountRest(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Hero />
      {mountRest && (
        <>
          <About />
          <Projects />
          <Blogs />
          <GithubActivity />
          <GithubRepos />
        </>
      )}
    </>
  );
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
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
      {/* <CustomCursor /> - Temporarily disabled to test scroll performance */}
      
      <GlobalBanner />
      {!isAdminRoute && <Navbar />}
      
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
          <Route path="/blog" element={<PageTransition><Blogs /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/project/:id" element={<PageTransition><React.Suspense fallback={<div className="min-h-screen"></div>}><ProjectDetail /></React.Suspense></PageTransition>} />
          <Route path="/projects/:status" element={<PageTransition><React.Suspense fallback={<div className="min-h-screen"></div>}><ProjectCategoryView /></React.Suspense></PageTransition>} />
          <Route path="/blog/:id" element={<PageTransition><React.Suspense fallback={<div className="min-h-screen"></div>}><BlogDetail /></React.Suspense></PageTransition>} />
          <Route path="/guestbook" element={<PageTransition><div className="min-h-screen pt-24 px-6"><Guestbook /></div></PageTransition>} />
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








