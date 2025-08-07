import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Kayode from '../assets/img/Kayode.webp';
import Twins from '../assets/img/ohiwerei twins.webp';
import ex1 from '../assets/img/experience 1.webp';
import ex2 from '../assets/img/experience 2.webp';
import ex3 from '../assets/img/experience 3.webp';
import ex4 from '../assets/img/experience 4.webp';
import ex5 from '../assets/img/experience 5.webp';
import ex6 from '../assets/img/experience 6.webp';
import ex7 from '../assets/img/experience 7.webp';
import ex8 from '../assets/img/experience 8.webp';
import ex9 from '../assets/img/experience 9.webp';
import ex10 from '../assets/img/experience 10.webp';
import ex11 from '../assets/img/experience 11.webp';
import ex12 from '../assets/img/experience 12.webp';
import ex13 from '../assets/img/experience 13.webp';
import ex14 from '../assets/img/experience 14.webp';
import ex15 from '../assets/img/experience 15.webp';
import ex16 from '../assets/img/experience 16.webp';
import ex17 from '../assets/img/experience 17.webp';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const tiltRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {

     // Scroll to top on page load
  window.scrollTo(0, 0);

    // Page entrance animations
    const tl = gsap.timeline({ delay: 0.3 });
    
    tl.from('.page-title', {
      y: 80,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out',
    })
    .from('.page-subtitle', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power4.out',
    }, '-=0.6')
    .from('.content-section', {
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power4.out',
    }, '-=0.4');

    // Gallery grid animations
    gsap.from('.gallery-item', {
      y: 100,
      opacity: 0,
      scale: 0.8,
      duration: 1,
      stagger: 0.15,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: '.gallery-grid',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });

    // 3D tilt effect setup
    tiltRefs.current.forEach((ref, index) => {
      if (ref) {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = ref.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const rotateX = (y - centerY) / centerY * -20;
          const rotateY = (x - centerX) / centerX * 20;
          
          gsap.to(ref, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            duration: 0.3,
            ease: 'power2.out',
          });
        };

        const handleMouseLeave = () => {
          gsap.to(ref, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.6,
            ease: 'power4.out',
          });
        };

        ref.addEventListener('mousemove', handleMouseMove);
        ref.addEventListener('mouseleave', handleMouseLeave);

        return () => {
          ref.removeEventListener('mousemove', handleMouseMove);
          ref.removeEventListener('mouseleave', handleMouseLeave);
        };
      }
    });

  }, []);

  const artworks = [
    {
      id: 1,
      title: "Photos of Lagos",
      artist: "Elena Rodriguez",
      year: "2024",
      medium: "Generative Art",
      description: "An exploration of algorithmic beauty through mathematical precision.",
      image: `${ex1}`,
      // image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 2,
      title: "Photos of Lagos",
      artist: "Marcus Chen",
      year: "2023",
      medium: "Interactive Installation",
      description: "A dynamic visualization of quantum mechanics principles.",
      image: `${ex2}`,
      // image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 3,
      title: "Photos of Lagos",
      artist: "Sophia Kim",
      year: "2024",
      medium: "AI-Generated",
      description: "Machine learning algorithms creating organic patterns.",
      image: `${ex3}`,
      // image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 4,
      title: "Photos of Lagos",
      artist: "Ahmed Hassan",
      year: "2023",
      medium: "Digital Sculpture",
      description: "Infinite complexity emerging from simple mathematical rules.",
      image: `${ex4}`,
      // image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 5,
      title: "Photos of Lagos",
      artist: "Isabella Torres",
      year: "2024",
      medium: "Procedural Art",
      description: "Color theory meets computational creativity.",
      image: `${ex5}`,
      // image: "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 6,
      title: "Photos of Lagos",
      artist: "David Park",
      year: "2023",
      medium: "Code Art",
      description: "When programming becomes a form of artistic expression.",
      image: `${ex6}`,
      // image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 7,
      title: "Photos of Lagos",
      artist: "David Park",
      year: "2023",
      medium: "Code Art",
      description: "When programming becomes a form of artistic expression.",
      image: `${ex7}`,
      // image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 8,
      title: "Photos of Lagos",
      artist: "David Park",
      year: "2023",
      medium: "Code Art",
      description: "When programming becomes a form of artistic expression.",
      image: `${ex8}`,
      // image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 9,
      title: "Photos of Lagos",
      artist: "David Park",
      year: "2023",
      medium: "Code Art",
      description: "When programming becomes a form of artistic expression.",
      image: `${ex9}`,
      // image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 10,
      title: "Photos of Lagos",
      artist: "David Park",
      year: "2023",
      medium: "Code Art",
      description: "When programming becomes a form of artistic expression.",
      image: `${ex10}`,
      // image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 11,
      title: "Photos of Lagos",
      artist: "David Park",
      year: "2023",
      medium: "Code Art",
      description: "When programming becomes a form of artistic expression.",
      image: `${ex11}`,
      // image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 12,
      title: "Photos of Lagos",
      artist: "David Park",
      year: "2023",
      medium: "Code Art",
      description: "When programming becomes a form of artistic expression.",
      image: `${ex12}`,
      // image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 13,
      title: "Photos of Lagos",
      artist: "David Park",
      year: "2023",
      medium: "Code Art",
      description: "When programming becomes a form of artistic expression.",
      image: `${ex13}`,
      // image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 14,
      title: "Photos of Lagos",
      artist: "David Park",
      year: "2023",
      medium: "Code Art",
      description: "When programming becomes a form of artistic expression.",
      image: `${ex14}`,
      // image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 15,
      title: "Photos of Lagos",
      artist: "David Park",
      year: "2023",
      medium: "Code Art",
      description: "When programming becomes a form of artistic expression.",
      image: `${ex15}`,
      // image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 16,
      title: "Photos of Lagos",
      artist: "David Park",
      year: "2023",
      medium: "Code Art",
      description: "When programming becomes a form of artistic expression.",
      image: `${ex16}`,
      // image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center",
    },
    {
      id: 17,
      title: "Photos of Lagos",
      artist: "David Park",
      year: "2023",
      medium: "Code Art",
      description: "When programming becomes a form of artistic expression.",
      image: `${ex17}`,
      // image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center",
    },
  ];

  return (
    <div className="min-h-screen bg-gallery-bg pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="page-title text-6xl md:text-8xl font-space-grotesk font-light mb-8">
            <span className="gradient-text">About </span>
            {/* <span className="gradient-text">About Our Gallery</span> */}
          </h1>
          
          <p className="page-subtitle text-xl md:text-2xl text-gallery-muted max-w-4xl mx-auto font-light leading-relaxed">
            The International VIP Collector Tour is curated by four passionate art world stakeholders with deep roots in Nigeria’s cultural scene and far-reaching international networks.
            United by a shared commitment to access, excellence, and thoughtful engagement, we offer an insider’s introduction to the people, places, and perspectives shaping contemporary African art.
            This experience is tailored for collectors who value intimacy, depth, and authenticity.
          </p>
        </div>
      </section>

      {/* Get to know us Section */}
      <section className="content-section py-16 px-6">
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
          {/* <p className="text-lg md:text-xl text-gallery-muted leading-relaxed">
            Our carefully curated collection spans generative art, AI-assisted creations, 
            interactive installations, and immersive digital experiences that challenge 
            conventional notions of what art can be in the 21st century.
          </p> */}
        </div>
      </section>
      
      <section className="content-section py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className='md:text-2xl font-space-grotesk mb-8'>
            The Ohiwerei Twins
          </h3>
          <p className="text-lg md:text-xl text-gallery-muted leading-relaxed mb-8">
            Ohi and Okhai are Nigerian art collectors and cultural entrepreneurs. They are co-founders of the Laho Foundation, dedicated to supporting African artists, and the Zwill Residency, which provides space and resources for emerging talent. They also host “Art People,” a podcast that explores the Nigerian art world through interviews and commentary, making art more accessible to a wider audience.
            Together, they are shaping the future of contemporary art in Africa with style, insight, and purpose.

          </p>
          <img src={Twins} alt="The Ohiwerei Twins" className='w-full max-w-md mx-auto rounded-lg shadow-md object-cover mb-8'/>
          {/* <p className="text-lg md:text-xl text-gallery-muted leading-relaxed">
            Our carefully curated collection spans generative art, AI-assisted creations, 
            interactive installations, and immersive digital experiences that challenge 
            conventional notions of what art can be in the 21st century.
          </p> */}
        </div>
      </section>

      {/* Featured Artworks Grid */}
      <section className="content-section py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-space-grotesk font-light mb-16 text-center text-secondary">
            Photos Of Lagos
          </h2>
          
          <div className="gallery-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((artwork, index) => (
              <div
                key={artwork.id}
                ref={(el) => (tiltRefs.current[index] = el)}
                className="gallery-item group hover-target"
              >
                <div className="relative overflow-hidden bg-gallery-surface rounded-lg hover-lift">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-xl font-space-grotesk font-medium text-foreground mb-2">
                      {artwork.title}
                    </h3>
                    {/* <p className="text-primary font-inter mb-1">
                      {artwork.artist} • {artwork.year}
                    </p>
                    <p className="text-gallery-muted text-sm mb-3">
                      {artwork.medium}
                    </p>
                    <p className="text-gallery-muted text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                      {artwork.description}
                    </p> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="content-section py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-space-grotesk font-light mb-8 text-accent">
            Experience Digital Art
          </h2>
          <p className="text-xl text-gallery-muted mb-12 leading-relaxed">
            Ready to explore the future of artistic expression? learn more about our collection and upcoming exhibitions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={() => window.location.href = '/contact'}
              className="px-10 py-4 bg-gradient-primary text-white hover-target transition-all duration-500 ease-out hover:shadow-primary hover:scale-105"
            >
              <span className="font-inter font-medium">Contact Us</span>
            </button>
            
            {/* <button 
              onClick={() => window.location.href = '/'}
              className="px-10 py-4 border-2 border-accent text-accent hover-target transition-all duration-500 ease-out hover:bg-accent hover:text-accent-foreground hover:shadow-accent"
            >
              <span className="font-inter font-medium">View More Works</span>
            </button> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;