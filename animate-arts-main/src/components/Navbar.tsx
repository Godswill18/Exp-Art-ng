import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { gsap } from 'gsap';
import Logo from '../assets/ex-logo-white.png'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const menuRef = useRef(); 

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // useEffect(() => {
  //   // const onLoad = () => {
  //   //   gsap.killTweensOf('.mobile-menu'); // reset mobile menu animations if stuck
  //   //   // ScrollTrigger.refresh(); // uncomment if you're using ScrollTrigger
  //   // };

  //   window.addEventListener('load', onLoad);
  //   return () => window.removeEventListener('load', onLoad);
  // }, []);

  useEffect(() => {
    // Animate navbar on load
    gsap.from('.navbar', {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: 'power4.out',
    });

    gsap.from('.nav-item', {
      y: -20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      delay: 0.3,
      ease: 'power4.out',
    });

     return () => {
      gsap.killTweensOf('.navbar');
      gsap.killTweensOf('.nav-item');
    };

  }, []);


    const openMenu = () => {
    setIsOpen(true);
    gsap.to(menuRef.current, { x: 0, duration: 0.5, ease: 'power4.out' });
  };

  const closeMenu = () => {
    setIsOpen(false);
    gsap.to(menuRef.current, { x: '100%', duration: 0.5, ease: 'power4.out' });
  };

  const toggleMenu = () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // const toggleMenu = () => {
  //   setIsOpen(!isOpen);
    
  //   if (!isOpen) {
  //     gsap.to('.mobile-menu', {
  //       x: 0,
  //       duration: 0.5,
  //       ease: 'power4.out',
  //     });
      
  //     gsap.from('.mobile-nav-item', {
  //       x: 50,
  //       opacity: 0,
  //       duration: 0.5,
  //       stagger: 0.1,
  //       delay: 0.2,
  //       ease: 'power4.out',
  //     });
  //   } else {
  //     gsap.to('.mobile-menu', {
  //       x: '100%',
  //       duration: 0.5,
  //       ease: 'power4.out',
  //     });
  //   }
  // };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Art Tours', path: '/art-tours' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className={`navbar fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled ? 'backdrop-blur-glass py-4' : 'bg-transparent py-6'
      }`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="nav-item text-2xl font-space-grotesk font-bold hover-target group"
          >
            {/* <span className="text-foreground group-hover:text-primary-glow transition-colors duration-300"> */}
              <img src={Logo} alt="Logo" className="inline-block h-20 mr-2" />
            {/* </span> */}
            {/* <span className="text-primary">.</span> */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-item relative px-4 py-2 font-inter font-medium hover-target group transition-colors duration-300 ${
                  location.pathname === item.path 
                    ? 'text-primary' 
                    : 'text-foreground hover:text-primary-glow'
                }`}
              >
                {item.name}
                {/* Animated underline */}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-primary transition-all duration-500 ease-out group-hover:w-full ${
                  location.pathname === item.path ? 'w-full' : 'w-0'
                }`} />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 z-50 hover-target"
            aria-label="Toggle menu"
          >
            {!isOpen ? (
              <Menu className="w-6 h-6 text-foreground" />
            ) : (
              ''
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
        <div
        ref={menuRef} // <-- Attach ref
        className="mobile-menu fixed top-0 right-0 h-full w-80 bg-card backdrop-blur-glass z-40"
        style={{ transform: 'translateX(100%)' }} // start hidden
      >

          <button
            onClick={toggleMenu}
            className="md:hidden p-10 z-50 hover-target"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 z-50 text-foreground" />
            ) : (
              ''
            )}
          </button>
        <div className="p-8 pt-20">
          <div className="space-y-6">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={toggleMenu}
                className={`mobile-nav-item block text-xl font-inter font-medium hover-target transition-colors duration-300 ${
                  location.pathname === item.path 
                    ? 'text-primary' 
                    : 'text-foreground hover:text-primary-glow'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-20 md:hidden"
          onClick={toggleMenu}
        />
      )}
    </>
  );
};

export default Navbar;