import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Logo from "../assets/ex-logo-white.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Art Tours", path: "/art-tours" },
    { name: "Contact", path: "/contact" },
  ];

  const navbarVariants: Variants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1, ease: "easeOut" } },
  };

  const navItemVariants: Variants = {
    hidden: { y: -20, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, delay: 0.3 + i * 0.1, ease: "easeOut" },
    }),
  };

  const mobileMenuVariants: Variants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { x: "100%", transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <>
      <motion.nav
        className={`navbar fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled ? "backdrop-blur-glass py-4" : "bg-transparent py-6"
        }`}
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <motion.div custom={0} variants={navItemVariants}>
            <Link
              to="/"
              className="nav-item text-2xl font-space-grotesk font-bold hover-target group"
            >
              <img src={Logo} alt="Logo" className="inline-block h-20 mr-2" />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, i) => (
              <motion.div key={item.name} custom={i + 1} variants={navItemVariants}>
                <Link
                  to={item.path}
                  className={`nav-item relative px-4 py-2 font-inter font-medium hover-target group transition-colors duration-300 ${
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-foreground hover:text-primary-glow"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-primary transition-all duration-500 ease-out group-hover:w-full ${
                      location.pathname === item.path ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 z-50 hover-target"
            aria-label="Toggle menu"
          >
            {!isOpen && <Menu className="w-6 h-6 text-foreground" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            className="mobile-menu fixed top-0 right-0 h-full w-80 bg-card backdrop-blur-glass z-40"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
          >
            <button
              onClick={toggleMenu}
              className="md:hidden p-10 z-50 hover-target"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 z-50 text-foreground" />
            </button>
            <div className="p-8 pt-20">
              <div className="space-y-6">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2 + index * 0.1,
                      ease: "easeOut",
                    }}
                  >
                    <Link
                      to={item.path}
                      onClick={toggleMenu}
                      className={`mobile-nav-item block text-xl font-inter font-medium hover-target transition-colors duration-300 ${
                        location.pathname === item.path
                          ? "text-primary"
                          : "text-foreground hover:text-primary-glow"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-background/50 backdrop-blur-sm z-20 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={toggleMenu}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
