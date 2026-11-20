import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/lib/motion';

interface DrawableCircle {
  x: number;
  y: number;
  update: () => void;
  draw: () => void;
}

const AnimatedCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const circlesRef = useRef<DrawableCircle[]>([]);
  const reducedMotion = usePrefersReducedMotion();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Circle class
    class Circle {
      x: number;
      y: number;
      radius: number;
      color: string;
      dx: number;
      dy: number;
      opacity: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 30 + 10;
        this.color = this.getRandomColor();
        this.dx = (Math.random() - 0.5) * 2;
        this.dy = (Math.random() - 0.5) * 2;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      getRandomColor() {
        const colors = [
          'rgb(99, 102, 241)', // primary
          'rgb(139, 92, 246)', // secondary
          'rgb(236, 72, 153)', // accent
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        // Mouse interaction
        const mouseDistance = Math.sqrt(
          Math.pow(mouseRef.current.x - this.x, 2) + 
          Math.pow(mouseRef.current.y - this.y, 2)
        );

        if (mouseDistance < 100) {
          const force = (100 - mouseDistance) / 100;
          const angle = Math.atan2(this.y - mouseRef.current.y, this.x - mouseRef.current.x);
          this.dx += Math.cos(angle) * force * 0.02;
          this.dy += Math.sin(angle) * force * 0.02;
        }

        // Update position
        this.x += this.dx;
        this.y += this.dy;

        // Boundary collision
        const rect = canvas.getBoundingClientRect();
        if (this.x - this.radius < 0 || this.x + this.radius > rect.width) {
          this.dx = -this.dx;
        }
        if (this.y - this.radius < 0 || this.y + this.radius > rect.height) {
          this.dy = -this.dy;
        }

        // Friction
        this.dx *= 0.99;
        this.dy *= 0.99;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace('rgb', 'rgba').replace(')', `, ${this.opacity})`);
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 10, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace('rgb', 'rgba').replace(')', `, ${this.opacity * 0.2})`);
        ctx.fill();
      }
    }

    // Initialize circles
    const initCircles = () => {
      circlesRef.current = [];
      const rect = canvas.getBoundingClientRect();
      for (let i = 0; i < 15; i++) {
        circlesRef.current.push(
          new Circle(
            Math.random() * rect.width,
            Math.random() * rect.height
          )
        );
      }
    };

    initCircles();

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw connections between nearby circles
      circlesRef.current.forEach((circle, i) => {
        for (let j = i + 1; j < circlesRef.current.length; j++) {
          const otherCircle = circlesRef.current[j];
          const distance = Math.sqrt(
            Math.pow(circle.x - otherCircle.x, 2) + 
            Math.pow(circle.y - otherCircle.y, 2)
          );

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(circle.x, circle.y);
            ctx.lineTo(otherCircle.x, otherCircle.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.3 - distance / 500})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      // Update and draw circles
      circlesRef.current.forEach(circle => {
        circle.update();
        circle.draw();
      });

      // Reduced motion: draw a single still frame instead of looping.
      if (!reducedMotion) animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-gradient-to-br from-gallery-surface to-gallery-bg rounded-lg"
      style={{ minHeight: '400px' }}
    />
  );
};

export default AnimatedCanvas;