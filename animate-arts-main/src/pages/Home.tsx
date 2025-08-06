import { Suspense, lazy, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

// Lazy load heavy components
const VantaWaves = lazy(() => import('../components/VantaWaves'));
const ThreeScene = lazy(() => import('../components/ThreeScene'));

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  useEffect(() => {

     // Scroll to top on page load
  window.scrollTo(0, 0);

    // Hero text animations
    const tl = gsap.timeline({ delay: 0.5 });
    
    tl.from('.hero-title', {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out',
    })
    .from('.hero-subtitle', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power4.out',
    }, '-=0.6')
    .from('.hero-buttons', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power4.out',
    }, '-=0.4')
    .from('.scroll-indicator', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power4.out',
    }, '-=0.2');

    // Scroll-triggered animations for sections
    gsap.utils.toArray('.section-content').forEach((section: any) => {
      gsap.from(section.querySelectorAll('.animate-on-scroll'), {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    // Parallax effect for Three.js sections
    gsap.utils.toArray('.parallax-section').forEach((section: any) => {
      gsap.to(section, {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

  }, []);

  const gotoAbout = () => {
    window.location.href = '/about';
  };
  // const viewOurWork = () => {
  //   const aboutSection = document.getElementById('about-section');
  //   aboutSection?.scrollIntoView({ behavior: 'smooth' });
  // };

  const handleGetInTouch = () => {
    window.location.href = '/contact';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Vanta Waves */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Suspense fallback={<div className="absolute inset-0 bg-gradient-hero" />}>
          <VantaWaves />
        </Suspense>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="hero-title text-6xl md:text-8xl font-inter font-light mb-6">
            <span className="gradient-hero-text">EXPERIENCE NIGERIA ART TOUR</span>
          </h1>
          
          <p className="hero-subtitle text-xl md:text-2xl text-gallery-muted mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Explore the intersection of art through our curated collection of contemporary digital artworks
          </p>
          
          <div className="hero-buttons flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={gotoAbout}
              className="group px-8 py-4 border-2 border-foreground text-foreground hover-target transition-all duration-500 ease-out hover:bg-foreground hover:text-background hover:shadow-elegant"
            >
              <span className="font-inter font-medium">Get to know us</span>
            </button>
            
            <button
              onClick={handleGetInTouch}
              className="group px-8 py-4 border-2 border-primary text-primary hover-target transition-all duration-500 ease-out hover:bg-primary hover:text-primary-foreground hover:shadow-primary"
            >
              <span className="font-inter font-medium">Get In Touch</span>
            </button>
          </div>
        </div>
        
        <div className="scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <ChevronDown className="w-8 h-8 text-foreground animate-bounce hover-target cursor-pointer" onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })} />
        </div>
      </section>

      {/* Outlined Dimensions Section */}
      <section id="about-section" className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
        <div className="parallax-section absolute inset-0 opacity-30">
          <Suspense fallback={null}>
            <ThreeScene mouseEffect={true} shapes="geometric" />
          </Suspense>
        </div>
        
        <div className="section-content relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="animate-on-scroll text-5xl md:text-7xl font-space-grotesk font-light mb-8">
            <span className="gradient-text">Outlined Dimensions</span>
          </h2>
          
          <p className="animate-on-scroll text-xl md:text-2xl text-gallery-muted mb-12 font-light leading-relaxed">
            Every piece in our collection represents a unique perspective on digital art, 
            where traditional boundaries dissolve into infinite possibilities.
          </p>
          
          <blockquote className="animate-on-scroll text-lg md:text-xl text-primary font-light italic">
            "Art is the most intense mode of individualism that the world has known."
          </blockquote>
        </div>
      </section>

      {/* Focus Geometry Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden bg-gallery-surface">
        <div className="parallax-section absolute inset-0 opacity-20">
          <Suspense fallback={null}>
            <ThreeScene mouseEffect={true} shapes="organic" />
          </Suspense>
        </div>
        
        <div className="section-content relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="animate-on-scroll text-5xl md:text-7xl font-space-grotesk font-light mb-8">
            <span className="gradient-text">Focus Geometry</span>
          </h2>
          
          <p className="animate-on-scroll text-xl md:text-2xl text-gallery-muted mb-12 font-light leading-relaxed">
            Precision meets creativity in our geometric abstractions, where mathematical beauty 
            merges with artistic expression to create something entirely new.
          </p>
          
          <blockquote className="animate-on-scroll text-lg md:text-xl text-secondary font-light italic">
            "Geometry is knowledge of the eternally existent."
          </blockquote>
        </div>
      </section>

      {/* Linear Motion Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
        <div className="parallax-section absolute inset-0 opacity-25">
          <Suspense fallback={null}>
            <ThreeScene mouseEffect={true} shapes="mixed" />
          </Suspense>
        </div>
        
        <div className="section-content relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="animate-on-scroll text-5xl md:text-7xl font-space-grotesk font-light mb-8">
            <span className="gradient-text">Linear Motion</span>
          </h2>
          
          <p className="animate-on-scroll text-xl md:text-2xl text-gallery-muted mb-12 font-light leading-relaxed">
            Movement and flow define our kinetic pieces, where static becomes dynamic 
            and viewers become part of the artistic experience.
          </p>
          
          <blockquote className="animate-on-scroll text-lg md:text-xl text-accent font-light italic">
            "Motion is the cause of all life."
          </blockquote>
          
          <div className="animate-on-scroll mt-16">
            <button 
              onClick={() => window.location.href = '/about'}
              className="group px-12 py-6 bg-gradient-primary text-white hover-target transition-all duration-500 ease-out hover:shadow-primary hover:scale-105"
            >
              <span className="font-inter font-medium text-lg">Discover More</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;