import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Blogs from './components/Blogs';
import Contact from './components/Contact';
import Admin from './components/Admin';
import ProjectDetail from './components/ProjectDetail';
import BlogDetail from './components/BlogDetail';

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Blogs />
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
          <Route path="/blog" element={<PageTransition><Blogs /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/project/:id" element={<PageTransition><ProjectDetail /></PageTransition>} />
          <Route path="/blog/:id" element={<PageTransition><BlogDetail /></PageTransition>} />
          
          <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
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
