import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // useMotionValue bypasses React state rendering for zero-lag performance
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring physics for ultra-smooth positional interpolation
  const springConfig = { damping: 30, stiffness: 800, mass: 0.2 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Hide if it's a touch device
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      setIsVisible(false);
    }

    const updateMousePosition = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      if (
        e.target.tagName?.toLowerCase() === 'a' ||
        e.target.tagName?.toLowerCase() === 'button' ||
        e.target.closest('a') ||
        e.target.closest('button') ||
        e.target.classList?.contains('cursor-pointer') ||
        e.target.closest('.cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[999999] flex items-center justify-center mix-blend-difference"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: isHovering ? '-20px' : '-4px',
        translateY: isHovering ? '-20px' : '-4px',
      }}
    >
      <motion.div 
        className="bg-white rounded-full"
        animate={{
          width: isHovering ? 40 : 8,
          height: isHovering ? 40 : 8,
          opacity: isHovering ? 0.8 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      />
    </motion.div>
  );
};

export default CustomCursor;
