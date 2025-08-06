import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { gsap } from 'gsap';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Animate 404 page
    gsap.from('.not-found-content', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power4.out',
    });

    gsap.from('.not-found-button', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      ease: 'power4.out',
    });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-20">
      <div className="not-found-content text-center px-6">
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-space-grotesk font-light gradient-text mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-inter font-medium text-foreground mb-4">
            Artwork Not Found
          </h2>
          <p className="text-lg text-gallery-muted max-w-md mx-auto leading-relaxed">
            The page you're looking for seems to have vanished into the digital void. 
            Let's get you back to exploring our gallery.
          </p>
        </div>
        
        <Link 
          to="/"
          className="not-found-button inline-block px-8 py-4 bg-gradient-primary text-white hover-target transition-all duration-500 ease-out hover:shadow-primary hover:scale-105"
        >
          <span className="font-inter font-medium">Return to Gallery</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
