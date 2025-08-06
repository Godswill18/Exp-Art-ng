import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Cpu, Cloud, Activity, Send, MapPin, Phone, Mail } from 'lucide-react';

// Lazy load the animated canvas
const AnimatedCanvas = lazy(() => import('../components/AnimatedCanvas'));

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const canvasRef = useRef<HTMLDivElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {

     // Scroll to top on page load
  window.scrollTo(0, 0);

  // Ensure button is visible initially
    if (submitBtnRef.current) {
      gsap.set(submitBtnRef.current, { opacity: 1, y: 0 }); // Set initial state
    }

    // Page entrance animations
    const tl = gsap.timeline({ delay: 0.3 });
    
    tl.from('.slide-in-left', {
      x: -100,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out',
    })
    .from('.slide-in-right', {
      x: 100,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out',
    }, '-=1')
    .from('.fade-in', {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power4.out',
    }, '-=0.6')
    .from('.blur-in', {
      filter: 'blur(10px)',
      opacity: 0,
      duration: 1.5,
      ease: 'power4.out',
    }, '-=0.8');

    // Icon hover animations
    const icons = document.querySelectorAll('.tech-icon');
    icons.forEach(icon => {
      icon.addEventListener('mouseenter', () => {
        gsap.to(icon, {
          scale: 1.2,
          rotationY: 360,
          color: '#ffffff',
          textShadow: '0 0 20px #6366f1',
          duration: 0.4,
          ease: 'power4.out',
        });
      });

      icon.addEventListener('mouseleave', () => {
        gsap.to(icon, {
          scale: 1,
          rotationY: 0,
          color: '#6366f1',
          textShadow: 'none',
          duration: 0.4,
          ease: 'power4.out',
        });
      });
    });

    // Form input focus animations
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        gsap.to(input, {
          borderColor: '#6366f1',
          boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.2)',
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      input.addEventListener('blur', () => {
        gsap.to(input, {
          borderColor: 'hsl(var(--border))',
          boxShadow: 'none',
          duration: 0.3,
          ease: 'power2.out',
        });
      });
    });

  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Animate submit button
    const submitBtn = document.querySelector('.submit-btn');
    gsap.to(submitBtn, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    });

    // Show success message (mock submission)
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gallery-bg pt-20 overflow-hidden">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Animated Canvas */}
        <div className="lg:w-1/2 relative bg-gallery-surface slide-in-left">
          <div className="p-8 lg:p-16 h-full flex flex-col justify-center">
            <div className="mb-12">
              <h1 className="text-4xl lg:text-6xl font-poppins font-light mb-6 text-foreground">
                Animated Technology
                <span className="block text-primary font-medium">Visuals</span>
              </h1>
              
              <p className="text-lg text-gallery-muted font-poppins leading-relaxed">
                Experience the intersection of art and technology through our 
                interactive digital gallery platform.
              </p>
            </div>

            {/* Technology Icons */}
            <div className="flex space-x-8 mb-12">
              <div className="tech-icon hover-target cursor-pointer">
                <Cpu className="w-12 h-12 text-primary transition-all duration-300" />
              </div>
              <div className="tech-icon hover-target cursor-pointer">
                <Cloud className="w-12 h-12 text-primary transition-all duration-300" />
              </div>
              <div className="tech-icon hover-target cursor-pointer">
                <Activity className="w-12 h-12 text-primary transition-all duration-300" />
              </div>
            </div>

            {/* Animated Canvas Container */}
            <div ref={canvasRef} className="flex-1 min-h-[300px] rounded-lg overflow-hidden blur-in">
              <Suspense fallback={
                <div className="w-full h-full bg-gradient-hero flex items-center justify-center">
                  <div className="animate-pulse text-primary">Loading visualization...</div>
                </div>
              }>
                <AnimatedCanvas />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="lg:w-1/2 bg-background slide-in-right">
          <div className="p-8 lg:p-16 h-full flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <h2 className="text-3xl lg:text-5xl font-geist font-light mb-4 text-foreground fade-in">
                Empower Your Future
              </h2>
              <h3 className="text-2xl lg:text-3xl font-geist font-medium mb-8 text-primary fade-in">
                With Technology
              </h3>

              <p className="text-gallery-muted font-poppins mb-12 leading-relaxed fade-in">
                Ready to explore the future of digital art? Connect with our team 
                to learn about exhibitions, artist collaborations, or technology partnerships.
              </p>

              {/* Contact Info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 fade-in">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-gallery-muted">Lagos, Nigeria</span>
                </div>
                <div className="flex items-center space-x-3 fade-in">
                  <Phone className="w-5 h-5 text-primary" />
                  <a href="tel:+2347075720266" className="text-gallery-muted">+234 7075 720 266</a>
                </div>
                <div className="flex items-center space-x-3 fade-in">
                  <Mail className="w-5 h-5 text-primary" />
                  <a href="mailto:info@ExperinceArt.com" className="text-gallery-muted">info@ExperinceArt.com</a>
                </div>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="fade-in">
                  <label htmlFor="name" className="block text-sm font-medium text-gallery-muted mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="form-input w-full px-4 py-3 bg-gallery-surface border border-border rounded-lg text-foreground placeholder-gallery-muted focus:outline-none transition-all duration-300"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="fade-in">
                  <label htmlFor="email" className="block text-sm font-medium text-gallery-muted mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input w-full px-4 py-3 bg-gallery-surface border border-border rounded-lg text-foreground placeholder-gallery-muted focus:outline-none transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="fade-in">
                  <label htmlFor="message" className="block text-sm font-medium text-gallery-muted mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="form-input w-full px-4 py-3 bg-gallery-surface border border-border rounded-lg text-foreground placeholder-gallery-muted focus:outline-none resize-none transition-all duration-300"
                    placeholder="Tell us about your project or inquiry"
                  />
                </div>

                <button
                  ref={submitBtnRef}
                  type="submit"
                  className="submit-btn w-full bg-gradient-primary text-white py-4 rounded-lg font-medium hover-target transition-all duration-500 ease-out hover:shadow-primary z-20 hover:scale-[1.02] fade-in opacity-100"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;