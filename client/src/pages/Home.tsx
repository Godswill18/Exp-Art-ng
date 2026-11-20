import { Suspense, lazy, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import * as motion from 'framer-motion/client';
import { useEventFlowStore } from '../store/useEventFlowStore';
import { usePageMeta } from '@/lib/usePageMeta';

// Lazy load heavy components
const VantaWaves = lazy(() => import('../components/VantaWaves'));
const ThreeScene = lazy(() => import('../components/ThreeScene'));

const Home = () => {
  usePageMeta({
    title: 'Experience Nigeria Art Tour | Lagos Art & Culture Tours',
    description:
      'Explore the intersection of art and culture in the heart of Lagos. A journey through creativity, connection, and the vibrant spirit of the city.',
    path: '/',
  });
  const { eventDays, loading, error, fetchEventDaysUser } = useEventFlowStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEventDaysUser();

    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => clearTimeout(timeout);
  }, [fetchEventDaysUser]);

  const gotoAbout = () => {
    window.location.href = '/about';
  };

  const handleGetInTouch = () => {
    window.location.href = '/contact';
  };

  // Format the event days data for display
  const formattedEventDays = [...eventDays]
    .sort((a, b) => {
      // Assuming a.day = "Day 1", "Day 2", etc.
      const numA = parseInt(a.day.replace(/\D/g, ""), 10);
      const numB = parseInt(b.day.replace(/\D/g, ""), 10);
      return numA - numB;
    })
    .map((day, index) => ({
      title: `Day ${index + 1} – ${day.date}`,
      items: day.activities.split("\n").filter((item) => item.trim() !== ""),
      delay: 0.3 + index * 0.2,
      duration: 0.4 + index * 0.2,
      // Single event will span full width, multiple will be in grid
      fullWidth: eventDays.length === 1,
    }));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Vanta Waves */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Suspense fallback={<div className="absolute inset-0 bg-gradient-hero" />}>
          <VantaWaves />
        </Suspense>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.h3 className="hero-title text-5xl md:text-8xl font-inter font-light mb-6"
             initial="hidden"
              whileInView="visible"
              viewport={{once: false, amount: 0.5}}
              transition={{delay: 0.2, duration: 0.5}}
              variants={{ 
              hidden: {opacity: 0, y: 100}, 
              visible: {opacity: 1, y: 0}}}>
            <span className="gradient-hero-text">EXPERIENCE NIGERIA ART TOUR</span>
          </motion.h3>
          
          <motion.p className="hero-subtitle text-xl md:text-2xl text-gallery-muted mb-12 max-w-2xl mx-auto font-light leading-relaxed"
              initial="hidden"
              whileInView="visible"
              viewport={{once: false, amount: 0.5}}
              transition={{delay: 0.28, duration: 0.40}}
              variants={{ 
              hidden: {opacity: 0, y: 50}, 
              visible: {opacity: 1, y: 0}}}>
            Explore the intersection of art and culture in the heart of Lagos. A journey through creativity, connection, and the vibrant spirit of the city.
          </motion.p>
          
          <motion.div className="hero-buttons flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{once: false, amount: 0.5}}
              transition={{delay: 0.70, duration: 0.90}}
              variants={{ 
              hidden: {opacity: 0, y: 50}, 
              visible: {opacity: 1, y: 0}}}>
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
          </motion.div>
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
          <motion.h2 className="animate-on-scroll text-5xl md:text-7xl font-space-grotesk font-light mb-16"
              initial="hidden"
                    whileInView="visible"
                    viewport={{once: false, amount: 0.5}}
                    transition={{delay: 0.10, duration: 0.20}}
                    variants={{ 
                    hidden: {opacity: 0, y: 0}, 
                    visible: {opacity: 1, y: -40}}}>

            <span className="gradient-text">Flow of Events</span>
          </motion.h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gallery-muted">Loading events...</p>
            </div>
          ) : error ? (
           <motion.div
              className="animate-on-scroll bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-lg"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.5 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 5 },
              }}
            >
              <h3 className="text-3xl font-semibold text-primary mb-4">
                Events Coming Soon
              </h3>
              <p className="text-lg text-gallery-muted">
                We're currently planning exciting events for you. Check back later for updates!
              </p>
            </motion.div>
          ) : eventDays.length === 0 ? (
            <motion.div
              className="animate-on-scroll bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-lg"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.5 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 5 },
              }}
            >
              <h3 className="text-3xl font-semibold text-primary mb-4">
                Events Coming Soon
              </h3>
              <p className="text-lg text-gallery-muted">
                We're currently planning exciting events for you. Check back later for updates!
              </p>
            </motion.div>
          ) : (
            <div className={`grid ${eventDays.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-10 text-left`}>
              {formattedEventDays.map((day, index) => (
                <motion.div
                  key={index}
                  className={`animate-on-scroll bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg ${
                    day.fullWidth ? "md:col-span-2" : ""
                  }`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ delay: day.delay, duration: day.duration }}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 5 },
                  }}
                >
                  <h3 className="text-2xl font-semibold text-primary mb-4">
                    {day.title}
                  </h3>
                  <ul className="list-disc list-inside text-lg text-gallery-muted space-y-2">
                    {day.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            className="animate-on-scroll mt-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            transition={{ delay: 1.0, duration: 1.30 }}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 5 },
            }}
          >
            <button
              onClick={() => (window.location.href = "/art-tours")}
              className="group px-12 py-6 bg-gradient-primary text-white hover-target transition-all duration-500 ease-out hover:shadow-primary hover:scale-105"
            >
              <span className="font-inter font-medium text-lg">Discover More</span>
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;