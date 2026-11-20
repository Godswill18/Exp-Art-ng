import { useEffect, useState } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor') as HTMLElement;
    const follower = document.querySelector('.cursor-follower') as HTMLElement;

    if (!cursor || !follower) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;
    let rafId = 0;

    // Mouse movement handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Smooth cursor animation
    const animateCursor = () => {
      // Cursor follows mouse with slight lag
      cursorX += (mouseX - cursorX) * 1.00;
      cursorY += (mouseY - cursorY) * 1.00;

      // Follower has more lag
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;

      gsap.set(cursor, {
        x: cursorX,
        y: cursorY,
      });

      gsap.set(follower, {
        x: followerX,
        y: followerY,
      });

      rafId = requestAnimationFrame(animateCursor);
    };

    // Hover effects for interactive elements
    const handleMouseEnter = () => {
      setIsHovering(true);
      gsap.to(cursor, {
        scale: 1.5,
        backgroundColor: 'hsl(var(--primary) / 0.5)',
        boxShadow: '0 0 15px hsl(var(--primary) / 0.4)',
        duration: 0.3,
        ease: 'power4.out',
      });
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: 'hsl(var(--primary) / 0.2)',
        boxShadow: 'none',
        duration: 0.3,
        ease: 'power4.out',
      });
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    
    // Interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], .hover-target');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Start animation
    animateCursor();

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div className={`custom-cursor ${isHovering ? 'hover' : ''}`} />
      <div className="cursor-follower" />
    </>
  );
};

export default CustomCursor;