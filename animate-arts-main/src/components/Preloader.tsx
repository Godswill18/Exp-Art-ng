import { useEffect, useState } from 'react';
import { gsap } from 'gsap';

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Initial setup
    gsap.set('.preloader-shape', { 
      scale: 0, 
      rotation: 0,
      opacity: 0 
    });

    // Animate shapes in sequence
    tl.to('.preloader-shape', {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      stagger: 0.2,
      ease: 'back.out(1.7)',
    })
    .to('.preloader-shape', {
      rotation: 360,
      duration: 2,
      ease: 'power2.inOut',
      stagger: 0.1,
      repeat: 1,
    }, '-=0.5')
    .to('.preloader-container', {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: 'power4.inOut',
      onComplete: () => {
        setIsLoading(false);
        setTimeout(onComplete, 300);
      }
    });

    // Color animation for shapes
    const shapes = document.querySelectorAll('.preloader-shape');
    shapes.forEach((shape, index) => {
      gsap.to(shape, {
        backgroundColor: `hsl(${239 + index * 30} 84% 67%)`,
        duration: 2,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
        delay: index * 0.2,
      });
    });

  }, [onComplete]);

  if (!isLoading) return null;

  return (
    <div className="preloader-container fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="relative">
        <div className="flex items-center justify-center space-x-4">
          {/* Square */}
          <div className="preloader-shape w-8 h-8 bg-primary rounded-sm" />
          {/* Triangle */}
          <div className="preloader-shape w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-secondary" />
          {/* Diamond */}
          <div className="preloader-shape w-6 h-6 bg-accent transform rotate-45" />
          {/* Circle */}
          <div className="preloader-shape w-8 h-8 bg-primary-glow rounded-full" />
        </div>
        
        <div className="mt-8 text-center">
          <h3 className="text-lg font-space-grotesk text-foreground animate-pulse">
            EXPERIENCE NIGERIA ART TOUR...
          </h3>
          <div className="mt-2 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;