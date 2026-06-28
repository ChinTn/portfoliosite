import React, { useEffect, useRef } from 'react';

const CanvasCursorEffect = () => {
  const canvasRef = useRef(null);
  const ripplesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Only apply if pointer is fine
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Get theme color
    const getThemeColor = () => {
      const root = document.documentElement;
      return getComputedStyle(root).getPropertyValue('--theme-highlight').trim() || '#2563eb';
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const createRipple = (x, y, isClick = false) => {
      // Hex to RGB to allow alpha blending
      const colorStr = getThemeColor();
      // Handle simple hex for now (most theme colors in this app are hex)
      let rgb = '99, 102, 241'; // Fallback indigo
      
      if (colorStr.startsWith('#')) {
        const hex = colorStr.replace('#', '');
        if (hex.length === 6) {
          rgb = `${parseInt(hex.substring(0, 2), 16)}, ${parseInt(hex.substring(2, 4), 16)}, ${parseInt(hex.substring(4, 6), 16)}`;
        }
      }

      ripplesRef.current.push({
        x,
        y,
        radius: isClick ? 5 : 2,
        maxRadius: isClick ? 100 : 30, // Click makes a much bigger wave
        alpha: isClick ? 0.8 : 0.4,
        fadeRate: isClick ? 0.015 : 0.02,
        growthRate: isClick ? 2 : 1,
        rgb: rgb
      });
    };

    let lastMouseX = -100;
    let lastMouseY = -100;

    const handleMouseMove = (e) => {
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Only spawn ripple if mouse moved enough distance
      if (dist > 15) {
        createRipple(e.clientX, e.clientY, false);
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    };

    const handleClick = (e) => {
      createRipple(e.clientX, e.clientY, true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const ripples = ripplesRef.current;
      
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r.rgb}, ${r.alpha})`;
        ctx.lineWidth = r.maxRadius === 100 ? 2 : 1; // Thicker for rock
        ctx.stroke();
        
        r.radius += r.growthRate;
        r.alpha -= r.fadeRate;
        
        if (r.alpha <= 0) {
          ripples.splice(i, 1);
        }
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9997]"
      style={{ display: 'block' }}
    />
  );
};

export default CanvasCursorEffect;
