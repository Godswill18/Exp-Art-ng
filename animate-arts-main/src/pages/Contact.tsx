import { Suspense, lazy, useState, ChangeEvent, FormEvent, useRef } from 'react';
import { motion, Variants } from 'framer-motion';
import { Earth, Club, Shell, Send, MapPin, Phone, Mail } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";

const AnimatedCanvas = lazy(() => import('../components/AnimatedCanvas'));

const Secreate_key = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6Lcw2qMrAAAAAG4HwZZhW6vgGd8pv7ia1D6mL4mH'

interface FormData {
  name: string;
  email: string;
  message: string;
}

// Animation Variants
const slideInLeft: Variants = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 1.2, ease: 'easeOut' } },
};

const slideInRight: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 1.2, ease: 'easeOut' } },
};

const fadeIn: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: (i: number = 0) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.1, duration: 1, ease: 'easeOut' },
  }),
};

const blurIn: Variants = {
  hidden: { filter: 'blur(10px)', opacity: 0 },
  visible: { filter: 'blur(0px)', opacity: 1, transition: { duration: 1.5, ease: 'easeOut' } },
};

const iconHover: Variants = {
  hover: {
    scale: 1.2,
    rotateY: 360,
    color: '#ffffff',
    textShadow: '0 0 20px #6366f1',
    transition: { duration: 0.4 },
  },
};

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

   const handleCaptchaChange = (value: string | null) => {
    setCaptchaVerified(!!value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

     if (!captchaVerified) {
      toast.error('Please verify the captcha before submitting.', { position: 'top-center' });
      return;
    }


   const timestamp =  new Date().toLocaleString('en-NG', {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

   // Set the hidden input value
  if (form.current) {
    (form.current.querySelector('input[name="timestamp"]') as HTMLInputElement).value = timestamp;
  }

  emailjs
    .sendForm('service_w2hm2wi', 'template_ynuakwk', form.current, {
      publicKey: 'Pu4lBns8h8EytDUVn',
    })
    .then(
      (result) => {
        console.log('SUCCESS!', result.text);
        toast.success('Your request has been sent successfully!', {position: 'top-center'});
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      },
      (error) => {
        console.log('FAILED...', error.text);
        toast.error('Oops! Something went wrong. Please try again later.');
      }
    );
  };

  return (
    <div className="min-h-screen bg-gallery-bg pt-20 overflow-hidden">
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Left */}
        <motion.div
          className="lg:w-1/2 relative bg-gallery-surface"
          variants={slideInLeft}
          initial="hidden"
          animate="visible"
        >
          <div className="p-8 lg:p-16 h-full flex flex-col justify-center">
            <div className="mb-12">
              <h1 className="text-4xl lg:text-6xl font-poppins font-light mb-6 text-foreground">
                Experience Nigeria
                <span className="block text-primary font-medium">Art Tour</span>
              </h1>
              <p className="text-lg text-gallery-muted font-poppins leading-relaxed">
                Explore the intersection of art and culture in the heart of Lagos.
              </p>
            </div>

            {/* Icons */}
            <div className="flex space-x-8 mb-12">
              {[Earth, Club, Shell].map((Icon, i) => (
                <motion.div
                  key={i}
                  variants={iconHover}
                  whileHover="hover"
                  className="tech-icon cursor-pointer"
                >
                  <Icon className="w-12 h-12 text-primary" />
                </motion.div>
              ))}
            </div>

            {/* Canvas */}
            <motion.div
              className="flex-1 min-h-[300px] rounded-lg overflow-hidden"
              variants={blurIn}
              initial="hidden"
              animate="visible"
            >
              <Suspense fallback={
                <div className="w-full h-full bg-gradient-hero flex items-center justify-center animate-pulse text-primary">
                  Loading visualization...
                </div>
              }>
                <AnimatedCanvas />
              </Suspense>
            </motion.div>
          </div>
        </motion.div>

        {/* Right */}
        <motion.div
          className="lg:w-1/2 bg-background"
          variants={slideInRight}
          initial="hidden"
          animate="visible"
        >
          <div className="p-8 lg:p-16 h-full flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              
              <motion.h2
                className="text-3xl lg:text-5xl font-geist font-light mb-4 text-foreground"
                custom={0}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
              >
                Explore Nigeria
              </motion.h2>

              <motion.h3
                className="text-2xl lg:text-3xl font-geist font-medium mb-8 text-primary"
                custom={1}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
              >
                With a guided Tour
              </motion.h3>

              <motion.p
                className="text-gallery-muted font-poppins mb-12 leading-relaxed"
                custom={2}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
              >
                Ready to explore the intersection of art and culture in Lagos. A journey through creativity and connection.
              </motion.p>

              {/* Contact Info */}
              <div className="space-y-4 mb-8">
                {[
                  { icon: MapPin, text: 'Lagos, Nigeria' },
                  { icon: Phone, text: '+234 7075 720 266', href: 'tel:+2347075720266' },
                  { icon: Mail, text: 'info@experiencenigeriaart.com', href: 'mailto:info@experiencenigeriaart.com' },
                ].map(({ icon: Icon, text, href }, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center space-x-3"
                    custom={i + 3}
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                  >
                    <Icon className="w-5 h-5 text-primary" />
                    {href ? (
                      <a href={href} className="text-gallery-muted">{text}</a>
                    ) : (
                      <span className="text-gallery-muted">{text}</span>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Form */}
              <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                <input type="hidden" name="timestamp" value="" />
                {['name', 'email', 'message'].map((field, i) => (
                  <motion.div
                    key={field}
                    custom={i + 6}
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                  >
                    <label htmlFor={field} className="block text-sm font-medium text-gallery-muted mb-2">
                      {field === 'name' ? 'Your Name' : field === 'email' ? 'Email Address' : 'Message'}
                    </label>

                    {field === 'message' ? (
                      <textarea
                        id={field}
                        name={field}
                        value={formData[field as keyof FormData]}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="form-input w-full px-4 py-3 bg-gallery-surface border border-border rounded-lg text-foreground placeholder-gallery-muted focus:outline-none resize-none"
                        placeholder="Tell us about your project or inquiry"
                      />
                    ) : (
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        id={field}
                        name={field}
                        value={formData[field as keyof FormData]}
                        onChange={handleInputChange}
                        required
                        className="form-input w-full px-4 py-3 bg-gallery-surface border border-border rounded-lg text-foreground placeholder-gallery-muted focus:outline-none"
                        placeholder={`Enter your ${field}`}
                      />
                    )}
                  </motion.div>
                ))}

                 {/* reCAPTCHA */}
                <ReCAPTCHA
                  sitekey={Secreate_key}
                  onChange={handleCaptchaChange}
                />

                <motion.button
                  whileTap={{ scale: 0.95 }}
                   type="submit"
                  disabled={!captchaVerified}
                  className={`w-full py-4 rounded-lg font-medium transition-all duration-300 ${
                    captchaVerified
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </span>
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
