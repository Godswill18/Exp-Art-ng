import { Suspense, lazy, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ComingSoonCard from '@/components/ui/ComingSooonCard';
import { useEventStore } from '@/context/EventStore';

// Lazy load components for performance
const TourCard = lazy(() => import('../components/TourCard'));
const ThreeScene = lazy(() => import('../components/ThreeScene'));

interface TicketOption {
  price: number;
  name: string;
}

interface Tour {
  id: number; 
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  image: string;
  tickets: {
    general: TicketOption;
    vip?: TicketOption;  // Made optional since your events might not have VIP
    free?: TicketOption; // Made optional
  };
}

interface TourCardProps {
  tour: Tour;
}

gsap.registerPlugin(ScrollTrigger);

const ArtTours = () => {
  const { events, loading, error, fetchEventsUser } = useEventStore();

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    // Fetch events data
    fetchEventsUser();

    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      clearTimeout(timeout);
    };
  }, [fetchEventsUser]);

  const formatTime = (timeString: string) => {
  if (!timeString) return '';
  
  // Try to parse different time formats
  const timeParts = timeString.match(/(\d{1,2}):(\d{2})/);
  if (!timeParts) return timeString;
  
  let hours = parseInt(timeParts[1]);
  const minutes = timeParts[2];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12
  
  return `${hours}:${minutes} ${ampm}`;
};



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
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-zinc-800/50 rounded-lg p-6 h-96 animate-pulse">
                  <div className="h-4 bg-zinc-700 rounded mb-4"></div>
                  <div className="h-3 bg-zinc-700 rounded mb-2"></div>
                  <div className="h-3 bg-zinc-700 rounded mb-2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-400 mb-16">
              Error loading tours: {error}
            </div>
          ) : events.length > 0 ? (
            <div className="tours-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {events.map((event) => (
                
                <div key={event._id} className="tour-card">
                  <Suspense fallback={
                    <div className="bg-zinc-800/50 rounded-lg p-6 h-96 animate-pulse">
                      <div className="h-4 bg-zinc-700 rounded mb-4"></div>
                      <div className="h-3 bg-zinc-700 rounded mb-2"></div>
                      <div className="h-3 bg-zinc-700 rounded mb-2"></div>
                    </div>
                  }>
                    <TourCard 
                      tour={{
                        id: event._id,
                        title: event.title,
                        description: event.description,
                        location: event.location,
                        date: event.date,
                        time: formatTime(event.time),
                        image: event.image,
                        tickets: {
                          general: { 
                            price: event.price, 
                            name: event.ticketType || "General" 
                          },
                          // free: {
                          //   price: formatPrice(event.price),
                          //   name: event.ticketType || "Free"
                          // },
                          // vip: {
                          //   price: formatPrice(event.price),
                          //   name: event.ticketType || "VIP"
                          // }
                        }
                      }} 
                    />
                  </Suspense>
                </div>
              ))}
            </div>
          ) : (
            <ComingSoonCard />
          )}

          {/* Footer */}
          <div className="tours-footer text-center bg-zinc-900/50 backdrop-blur-sm rounded-lg p-8 border border-zinc-800">
            <h3 className="text-2xl font-semibold mb-4 font-inter">
              Looking for Group Bookings?
            </h3>
            <p className="text-gray-300 mb-6 font-inter max-w-2xl mx-auto">
              Contact us for special group rates and customized tour experiences tailored to your organization's interests and schedule.
            </p>
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 font-inter">
              Contact for Group Tours
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtTours;