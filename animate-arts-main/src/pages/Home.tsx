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

      <section id="about-section" className="relative min-h-screen py-20 overflow-hidden">
  <div className="parallax-section absolute inset-0 opacity-30">
    <Suspense fallback={null}>
      <ThreeScene mouseEffect={true} shapes="geometric" />
    </Suspense>
  </div>

  <div className="section-content relative z-10 max-w-6xl mx-auto px-6 text-center">
    <h2 className="animate-on-scroll text-5xl md:text-7xl font-space-grotesk font-light mb-16">
      <span className="gradient-text">Flow of Events</span>
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
      {/* Day 1 */}
      <div className="animate-on-scroll bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-primary mb-4">Day 1 – Wednesday, Nov 5</h3>
        <ul className="list-disc list-inside text-lg text-gallery-muted space-y-2">
          <li>Airport concierge / fast-track immigration</li>
          <li>Local SIM + Data</li>
          <li>Transfer to hotel / accommodation</li>
          <li>Welcome Dinner</li>
        </ul>
      </div>

      {/* Day 2 */}
      <div className="animate-on-scroll bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-primary mb-4">Day 2 – Thursday Nov 6</h3>
        <ul className="list-disc list-inside text-lg text-gallery-muted space-y-2">
          <li>    Collectors preview of art X</li>
          <li>Victor Ehikamenor studio visit</li>
          <li>VIP ART X opening</li>
        </ul>
      </div>

      {/* Day 3 */}
      <div className="animate-on-scroll bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-primary mb-4">Day 3 – Friday Nov 7 (Art X Lagos VIP Experience)</h3>
        <ul className="list-disc list-inside text-lg text-gallery-muted space-y-2">
          <li>Studio Visits Nengi Omoku </li>
          <li>Dinner at Adebola Gallery, followed by Art X Live and/or a club night. </li>
        </ul>
      </div>

      {/* Day 4 */}
      <div className="animate-on-scroll bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-primary mb-4">Day 4 – Thursday Nov 8</h3>
        <ul className="list-disc list-inside text-lg text-gallery-muted space-y-2">
        <li>REST DAY (Explore Lagos)</li>
        </ul>
      </div>

      {/* Day 5 */}
      <div className="animate-on-scroll bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg md:col-span-2">
        <h3 className="text-2xl font-semibold text-primary mb-4">Day 5 – Sunday Nov 9</h3>
        <ul className="list-disc list-inside text-lg text-gallery-muted space-y-2">
          <li>Day trip to Benin Edo state - 10am -  5pm</li>
        </ul>
      </div>
    </div>
     <div className="animate-on-scroll mt-16">
            <button 
              onClick={() => window.location.href = '/art-tours'}
              className="group px-12 py-6 bg-gradient-primary text-white hover-target transition-all duration-500 ease-out hover:shadow-primary hover:scale-105"
            >
              <span className="font-inter font-medium text-lg">Discover More</span>
            </button>
          </div>
  </div>
  
</section>


      {/* Outlined Dimensions Section */}
      {/* <section id="about-section" className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
        <div className="parallax-section absolute inset-0 opacity-30">
          <Suspense fallback={null}>
            <ThreeScene mouseEffect={true} shapes="geometric" />
          </Suspense>
        </div>
        
        <div className="section-content relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="animate-on-scroll text-5xl md:text-7xl font-space-grotesk font-light mb-8">
            <span className="gradient-text">Flow of Events</span>
          </h2>
          
          <p className="animate-on-scroll text-xl md:text-2xl text-gallery-muted mb-12 font-light leading-relaxed">
         Day 1 – Wednesday Nov 5 (Arrival + Welcome)


          </p>
          
          <blockquote className="animate-on-scroll text-lg md:text-xl text-primary font-light italic">
           Airport concierge / fast-track immigration
                Local SIM + Data
                Transfer to hotel / accommodation
                Welcome Dinner 
          </blockquote>
        </div>
      </section> */}

      {/* Focus Geometry Section */}
      {/* <section className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden bg-gallery-surface">
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
            Day 2 – Thursday Nov 6
          </p>
          
          <blockquote className="animate-on-scroll text-lg md:text-xl text-secondary font-light italic">
                        Collectors preview of art X
              Victor Ehikamenor studio visit
              VIP ART X opening

          </blockquote>
        </div>
      </section> */}

      {/* Linear Motion Section */}
      {/* <section className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
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
            Day 3 – Friday Nov 7 (Art X Lagos VIP Experience)
          </p>
          
          <blockquote className="animate-on-scroll text-lg md:text-xl text-accent font-light italic">
           Studio Visits Nengi Omoku 
              Dinner at Adebola Gallery, followed by Art X Live and/or a club night. 

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
      </section> */}

      {/* <section className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
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
            Day 4 – Thursday Nov 8
          </p>
          
          <blockquote className="animate-on-scroll text-lg md:text-xl text-accent font-light italic">
            REST DAY (Explore Lagos)

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


        <div className="section-content relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="animate-on-scroll text-5xl md:text-7xl font-space-grotesk font-light mb-8">
            <span className="gradient-text">Linear Motion</span>
          </h2>
          
          <p className="animate-on-scroll text-xl md:text-2xl text-gallery-muted mb-12 font-light leading-relaxed">
            Day 5 – Sunday Nov 9
          </p>
          
          <blockquote className="animate-on-scroll text-lg md:text-xl text-accent font-light italic">
            Day trip to Benin Edo state
            10am -  5pm


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
      </section> */}
    </div>
  );
};

export default Home;