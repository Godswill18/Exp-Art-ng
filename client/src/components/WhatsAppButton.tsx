import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { SocialIcon } from 'react-social-icons';

const WhatsAppButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleWhatsAppClick = () => {
    // Replace with your actual WhatsApp number (in international format without + or spaces)
    const phoneNumber = "+2347075720266"; // Update this with your actual number
    const message = "Hello! I'm interested in your art Tour.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        fixed bottom-6 right-6 z-50 
        w-14 h-14 rounded-full 
        bg-[#25D366] hover:bg-[#128C7E] 
        text-white shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        hover:scale-110 active:scale-95
        group
        ${isHovered ? 'shadow-[0_0_20px_rgba(37,211,102,0.5)]' : ''}
      `}
      aria-label="Contact us on WhatsApp"
      title="Contact us on WhatsApp"
    >
      {/* <MessageCircle 
        size={24} 
        className="transition-transform duration-300 group-hover:scale-110" 
      /> */}
      
      {/* Pulse animation */}
      <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></div>
      <SocialIcon
          network="whatsapp"
          bgColor="transparent"
          style={{ height: 45, width: 45 }}
          className="h-6 w-6"
        />
    </button>
  );
};

export default WhatsAppButton;