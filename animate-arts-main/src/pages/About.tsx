import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as motion from 'motion/react-client';
import Kayode from '../assets/img/Kayode.webp';
import Twins from '../assets/img/ohiwerei twins.webp';
import { useGalleryStore } from '../store/useGalleryStore';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const tiltRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { gallery, loading, fetchGalleryUser } = useGalleryStore();

  // Fetch gallery data on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchGalleryUser();
  }, [fetchGalleryUser]);

  // Setup tilt effect whenever gallery changes
  useEffect(() => {
    if (!tiltRefs.current.length) return;

    const cleanups: (() => void)[] = [];

    tiltRefs.current.forEach((ref) => {
      if (!ref) return;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = ref.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -20;
        const rotateY = ((x - centerX) / centerX) * 20;

        gsap.to(ref, {
          rotationX: rotateX,
          rotationY: rotateY,
          transformPerspective: 1000,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(ref, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.6,
          ease: "power4.out",
        });
      };

      ref.addEventListener("mousemove", handleMouseMove);
      ref.addEventListener("mouseleave", handleMouseLeave);

      cleanups.push(() => {
        ref.removeEventListener("mousemove", handleMouseMove);
        ref.removeEventListener("mouseleave", handleMouseLeave);
      });
    });

    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      clearTimeout(timeout);
    };
  }, [gallery]); // Add gallery as dependency

  // Reset tiltRefs when gallery changes
 useEffect(() => {
  if (!Array.isArray(gallery)) return;
  tiltRefs.current = tiltRefs.current.slice(0, gallery.length);
}, [gallery]);


  return (
    <div className="min-h-screen bg-gallery-bg pt-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 px-6 " >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 className="page-title text-6xl md:text-8xl font-space-grotesk font-light mb-8" 
          initial="hidden"
          whileInView="visible"
          viewport={{once: false, amount: 0.5}}
          transition={{delay: 0.3, duration: 1.2}}
          variants={{ 
          hidden: {opacity: 0, y: 40}, 
          visible: {opacity: 1, y: 5}}}>
            <span className="gradient-text">About </span>
          </motion.h1>
          
          <motion.p className="page-subtitle text-xl md:text-2xl text-gallery-muted max-w-4xl mx-auto font-light leading-relaxed"
           initial="hidden"
          whileInView="visible"
          viewport={{once: false, amount: 0.5}}
          transition={{delay: 0.2, duration: 1.0}}
          variants={{ 
          hidden: {opacity: 0, y: 50}, 
          visible: {opacity: 1, y: 5}}}>
            The International VIP Collector Tour is curated by four passionate art world stakeholders with deep roots in Nigeria's cultural scene and far-reaching international networks.
            United by a shared commitment to access, excellence, and thoughtful engagement, we offer an insider's introduction to the people, places, and perspectives shaping contemporary African art.
            This experience is tailored for collectors who value intimacy, depth, and authenticity.
          </motion.p>
        </div>
      </section>

      {/* Get to know us Section */}
      <motion.section className="content-section py-16 px-6"
       initial="hidden"
          whileInView="visible"
          viewport={{once: false, amount: 0.10}}
          transition={{delay: 0.2, duration: 1.0}}
          variants={{ 
          hidden: {opacity: 0, y: 60}, 
          visible: {opacity: 1, y: 5}}}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-space-grotesk font-light mb-8 text-primary text-center">
            Get to Know Us
          </h2>
          <h3 className='md:text-2xl font-space-grotesk mb-8'>
            Kayode Adegbola
          </h3>
          <p className="text-lg md:text-xl text-gallery-muted leading-relaxed mb-8">
            Kayode Adegbola has produced art exhibitions since 2010. He is a keen art collector, the founder of The Vault Artist Residency, and has supported institutional shows.
             Kayode was an instrumental contributor to the Nigerian Pavilion at the London Design Biennale in 2023.
          </p>
          <img src={Kayode} alt="Kayode" className='w-full max-w-md mx-auto rounded-lg shadow-md object-cover mb-8' />
        </div>
      </motion.section>
      
      <motion.section className="content-section py-16 px-6"
        initial="hidden"
          whileInView="visible"
          viewport={{once: false, amount: 0.10}}
          transition={{delay: 0.2, duration: 1.0}}
          variants={{ 
          hidden: {opacity: 0, y: 60}, 
          visible: {opacity: 1, y: 5}}}>
        <div className="max-w-4xl mx-auto">
          <h3 className='md:text-2xl font-space-grotesk mb-8'>
            The Ohiwerei Twins
          </h3>
          <p className="text-lg md:text-xl text-gallery-muted leading-relaxed mb-8">
            Ohi and Okhai are Nigerian art collectors and cultural entrepreneurs. They are co-founders of the Laho Foundation, dedicated to supporting African artists, and the Zwill Residency, which provides space and resources for emerging talent. They also host "Art People," a podcast that explores the Nigerian art world through interviews and commentary, making art more accessible to a wider audience.
            Together, they are shaping the future of contemporary art in Africa with style, insight, and purpose.
          </p>
          <img src={Twins} alt="The Ohiwerei Twins" className='w-full max-w-md mx-auto rounded-lg shadow-md object-cover mb-8'/>
        </div>
      </motion.section>

      {/* Photos of Lagos Grid */}
      <section className="content-section py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-space-grotesk font-light mb-16 text-center text-secondary">
            Photos Of Lagos
          </h2>
          
       {loading ? (
            <div className="text-center py-12">
              <p className="text-gallery-muted">Loading photos...</p>
            </div>
          ) : gallery?.length === 0 ? (
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-12 text-center max-w-2xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <h3 className="text-2xl md:text-3xl font-space-grotesk text-primary mb-4">
                Our Gallery is Being Prepared
              </h3>
              <p className="text-lg text-gallery-muted">
                No images in the gallery at the moment, but we're preparing the best visual experience for you.
              </p>
              <div className="mt-6">
                <button 
                  onClick={() => fetchGalleryUser()}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Check Again
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="gallery-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gallery?.map((item, index) => (
                <div
                  key={item._id}
                  ref={(el) => (tiltRefs.current[index] = el)}
                  className="gallery-item group hover-target"
                >
                  <div className="relative overflow-hidden bg-gallery-surface rounded-lg hover-lift">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_IMAGE_URL}/${item.image}`}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-xl font-space-grotesk font-medium text-foreground mb-2">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-gallery-muted text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* Call to Action */}
      <motion.section className="content-section py-20 px-6 text-center"
        initial="hidden"
          whileInView="visible"
          viewport={{once: false, amount: 0.10}}
          transition={{delay: 0.2, duration: 1.0}}
          variants={{ 
          hidden: {opacity: 0, y: 60}, 
          visible: {opacity: 1, y: 5}}}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-space-grotesk font-light mb-8 text-accent">
            Experience Lagos
          </h2>
          <p className="text-xl text-gallery-muted mb-12 leading-relaxed">
            Ready to explore the energy of Lagos and the vibrant world of Art X? Immerse yourself in the city's art, culture, and creativity like never before.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={() => window.location.href = '/contact'}
              className="px-10 py-4 bg-gradient-primary text-white hover-target transition-all duration-500 ease-out hover:shadow-primary hover:scale-105"
            >
              <span className="font-inter font-medium">Contact Us</span>
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;