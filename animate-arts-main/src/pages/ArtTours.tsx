import { Suspense, lazy, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ComingSoonCard from '@/components/ui/ComingSooonCard';

// Lazy load components for performance
const TourCard = lazy(() => import('../components/TourCard'));
const ThreeScene = lazy(() => import('../components/ThreeScene'));

gsap.registerPlugin(ScrollTrigger);

// Mock tour data
const tourData = [
  {
    id: 1,
    title: "Modern Art Exploration",
    description: "Discover the evolution of modern art through interactive guided tours featuring contemporary masterpieces, avant-garde installations, and revolutionary artistic movements that shaped the 20th century. Experience art like never before with expert commentary and behind-the-scenes insights.",
    location: "Lagos, Nigeria",
    date: "August 15, 2025",
    time: "10:00 AM - 2:00 PM",
    image: "/api/placeholder/400/300",
    tickets: {
      general: { price: 30, name: "General Admission" },
      vip: { price: 75, name: "VIP Experience" }
    }
  },
  {
    id: 2,
    title: "Classical Renaissance Journey",
    description: "Step back in time and immerse yourself in the golden age of Renaissance art. This comprehensive tour showcases magnificent works from master painters, sculptors, and architects who defined artistic excellence during this pivotal period in human creativity.",
   location: "Lagos, Nigeria",
    date: "August 22, 2025",
    time: "1:00 PM - 5:00 PM",
    image: "/api/placeholder/400/300",
    tickets: {
      general: { price: 35, name: "General Admission" },
      vip: { price: 85, name: "VIP Experience" }
    }
  },
  {
    id: 3,
    title: "Abstract & Surrealism",
    description: "Explore the mind-bending world of abstract and surrealist art movements. This fascinating journey takes you through dreamlike landscapes, impossible geometries, and revolutionary artistic expressions that challenged conventional perception and reality.",
    location: "Lagos, Nigeria",
    date: "September 5, 2025",
    time: "11:00 AM - 3:00 PM",
    image: "/api/placeholder/400/300",
    tickets: {
      general: { price: 40, name: "General Admission" },
      vip: { price: 90, name: "VIP Experience" }
    }
  },
  {
    id: 4,
    title: "Contemporary Digital Art",
    description: "Experience the cutting-edge world of digital and interactive art installations. This tour showcases how technology and creativity merge to create immersive experiences, virtual reality artworks, and AI-generated masterpieces of the digital age.",
    location: "Lagos, Nigeria",
    date: "September 12, 2025",
    time: "2:00 PM - 6:00 PM",
    image: "/api/placeholder/400/300",
    tickets: {
      general: { price: 45, name: "General Admission" },
      vip: { price: 95, name: "VIP Experience" }
    }
  },
  {
    id: 5,
    title: "Sculpture Garden Walking Tour",
    description: "Discover monumental sculptures and outdoor installations in our beautiful sculpture garden. This walking tour combines art appreciation with nature, featuring works from renowned sculptors in a serene outdoor setting perfect for contemplation and inspiration.",
    location: "Lagos, Nigeria",
    date: "September 19, 2025",
    time: "9:00 AM - 12:00 PM",
    image: "/api/placeholder/400/300",
    tickets: {
      general: { price: 25, name: "General Admission" },
      vip: { price: 65, name: "VIP Experience" }
    }
  }
];

const ArtTours = () => {
  useEffect(() => {

     // Scroll to top on page load
  window.scrollTo(0, 0);

    // Header animation
    gsap.fromTo('.art-tours-header', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power4.out' }
    );

    // Tour cards scroll animation
    gsap.fromTo('.tour-card', 
      { opacity: 0, y: 48 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6,
        stagger: 0.15,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.tours-grid',
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Footer animation
    gsap.fromTo('.tours-footer',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.tours-footer',
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <Suspense fallback={<div className="absolute inset-0 bg-zinc-950" />}>
          <ThreeScene 
            shapes="geometric" 
            className="w-full h-full opacity-30"
            mouseEffect={true}
          />
        </Suspense>
      </div>

      {/* Content */}
      <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 art-tours-header">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-space-grotesk">
              <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent hover:from-white hover:via-blue-300 hover:to-white transition-all duration-500">
                Art Tours
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto font-inter">
              Embark on guided journeys through artistic masterpieces and discover the stories behind the world's most captivating artworks.
            </p>
          </div>





          {/* Tours Grid */}
          {/* <div className="tours-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {tourData.map((tour) => (
              <div key={tour.id} className="tour-card">
                <Suspense fallback={
                  <div className="bg-zinc-800/50 rounded-lg p-6 h-96 animate-pulse">
                    <div className="h-4 bg-zinc-700 rounded mb-4"></div>
                    <div className="h-3 bg-zinc-700 rounded mb-2"></div>
                    <div className="h-3 bg-zinc-700 rounded mb-2"></div>
                  </div>
                }>
                  <TourCard tour={tour} />
                </Suspense>
              </div>
            ))}
          </div> */}
          <ComingSoonCard/>

          {/* comming soon card  */}

          {/* Footer */}
          {/* <div className="tours-footer text-center bg-zinc-900/50 backdrop-blur-sm rounded-lg p-8 border border-zinc-800">
            <h3 className="text-2xl font-semibold mb-4 font-inter">
              Looking for Group Bookings?
            </h3>
            <p className="text-gray-300 mb-6 font-inter max-w-2xl mx-auto">
              Contact us for special group rates and customized tour experiences tailored to your organization's interests and schedule.
            </p>
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 font-inter">
              Contact for Group Tours
            </button>
          </div> */}
         
        </div>
      </div>
    </div>
  );
};

export default ArtTours;