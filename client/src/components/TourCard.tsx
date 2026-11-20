import { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Plus, Minus } from 'lucide-react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { resolveImageUrl } from '@/lib/image';

interface TicketOption {
  price: number;
  name: string;
}

interface Tour {
  id: string | number;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  image: string;
  tickets: {
    general: TicketOption;
    vip?: TicketOption;
    free?: TicketOption;
  };
}

interface TourCardProps {
  tour: Tour;
}

const TourCard = ({ tour }: TourCardProps) => {
  const [selectedTicket, setSelectedTicket] = useState<'general' | 'vip'>('general');
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const currentTicket = tour.tickets[selectedTicket] ?? tour.tickets.general;
  const totalCost = currentTicket.price * quantity;

  useEffect(() => {
    const card = document.querySelector(`[data-tour-id="${tour.id}"]`);
    if (!card) return;

    if (isHovered) {
      gsap.to(card, {
        scale: 1.05,
        rotationY: 5,
        rotationX: 2,
        boxShadow: '0 20px 40px rgba(99, 102, 241, 0.2)',
        duration: 0.4,
        ease: 'power4.out'
      });
      
      gsap.to(card.querySelector('.tour-overlay'), {
        opacity: 0.15,
        duration: 0.4,
        ease: 'power4.out'
      });
    } else {
      gsap.to(card, {
        scale: 1,
        rotationY: 0,
        rotationX: 0,
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
        duration: 0.4,
        ease: 'power4.out'
      });
      
      gsap.to(card.querySelector('.tour-overlay'), {
        opacity: 0,
        duration: 0.4,
        ease: 'power4.out'
      });
    }
  }, [isHovered, tour.id]);

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, Math.min(10, quantity + change));
    setQuantity(newQuantity);
    
    // Add a subtle animation feedback
    const quantityElement = document.querySelector(`[data-tour-id="${tour.id}"] .quantity-display`);
    if (quantityElement) {
      gsap.fromTo(quantityElement, 
        { scale: 1.2, color: '#3B82F6' },
        { scale: 1, color: '#ffffff', duration: 0.3, ease: 'power4.out' }
      );
    }
  };

const formatPrice = (price: number): string => {
  // Handle null/undefined/NaN cases
  if (price === null || price === undefined || isNaN(price)) {
    return '0';
  }
  
  // Handle zero case
  if (price === 0) {
    return '0';
  }
  
  // Format positive numbers with commas
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

  return (
    <div
      data-tour-id={tour.id}
      className="bg-zinc-900/80 backdrop-blur-sm rounded-lg overflow-hidden border border-zinc-800 hover-target relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Hover overlay */}
      <div className="tour-overlay absolute inset-0 bg-indigo-500 opacity-0 pointer-events-none"></div>
      
      {/* Tour Image */}
      <div className="relative h-48 bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden">
        <img
          src={resolveImageUrl(tour.image)}
          alt={tour.title}
          width={600}
          height={192}
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent"></div>
      </div>

      <div className="p-6">
        {/* Tour Title */}
        <h3 className="text-xl font-bold mb-3 font-inter text-white group-hover:text-indigo-300 transition-colors duration-300">
          {tour.title}
        </h3>

        {/* Tour Description */}
        <p className="text-gray-300 text-sm mb-4 font-inter leading-relaxed">
          {tour.description}
        </p>

        {/* Tour Details */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-sm text-gray-400 font-poppins">
            <MapPin size={16} className="mr-2 text-indigo-400" />
            {tour.location}
          </div>
          <div className="flex items-center text-sm text-gray-400 font-poppins">
            <Calendar size={16} className="mr-2 text-indigo-400" />
            {tour.date}
          </div>
          <div className="flex items-center text-sm text-gray-400 font-poppins">
            <Clock size={16} className="mr-2 text-indigo-400" />
            {tour.time}
          </div>
        </div>

        {/* Ticket Selection */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3 text-gray-200 font-inter">
            Select Ticket Type:
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(tour.tickets) as [string, TicketOption | undefined][]).map(([type, ticket]) =>
              ticket ? (
              <button
                key={type}
                onClick={() => setSelectedTicket(type as 'general' | 'vip')}
                className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 font-inter ${
                  selectedTicket === type
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                <div className="font-semibold">{ticket.name}</div>
                <div className="text-xs opacity-90">₦ {formatPrice(ticket.price)}</div>
              </button>
              ) : null
            )}
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3 text-gray-200 font-inter">
            Number of Tickets:
          </h4>
          <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-2">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <Minus size={16} />
            </button>
            
            <span className="quantity-display text-lg font-semibold font-inter">
              {quantity}
            </span>
            
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= 10}
              className="w-8 h-8 rounded-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Total Cost */}
        <div className="mb-6 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <div className="flex justify-between items-center font-inter">
            <span className="text-gray-300">Total Cost:</span>
            <span className="text-xl font-bold text-indigo-400">
              ₦ {formatPrice(totalCost)}
            </span>
          </div>
        </div>

        {/* Online booking is not available yet: route visitors to the contact form
            (a real, working channel) instead of simulating a reservation. */}
        <Link
          to={`/contact?enquiry=${encodeURIComponent(`${tour.title} - ${quantity} x ${currentTicket.name} ticket(s)`)}`}
          className="reserve-button block text-center w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 font-inter"
        >
          Enquire to Reserve
        </Link>
        <p className="mt-2 text-center text-xs text-gray-400 font-inter">
          Online ticket booking is coming soon. Send us an enquiry and we will confirm availability.
        </p>
      </div>
    </div>
  );
};

export default TourCard;