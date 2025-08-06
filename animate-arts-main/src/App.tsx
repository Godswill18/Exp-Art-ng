import { Suspense, lazy, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const ArtTours = lazy(() => import("./pages/ArtTours"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Navbar = lazy(() => import("./components/Navbar"));
const CustomCursor = lazy(() => import("./components/CustomCursor"));
const Preloader = lazy(() => import("./components/Preloader"));
const WhatsAppButton = lazy(() => import("./components/WhatsAppButton"));

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {isLoading ? (
          <Suspense fallback={<div className="fixed inset-0 bg-background" />}>
            <Preloader onComplete={handlePreloaderComplete} />
          </Suspense>
        ) : (
          <BrowserRouter>
            <div className="relative">
              <Suspense fallback={null}>
                <CustomCursor />
              </Suspense>
              
              <Suspense fallback={<div className="h-20 bg-background" />}>
                <Navbar />
              </Suspense>
              
              <main>
                <Suspense fallback={
                  <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="animate-pulse text-primary text-xl">Loading...</div>
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/art-tours" element={<ArtTours />} />
                    <Route path="/contact" element={<Contact />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              
              <Suspense fallback={null}>
                <WhatsAppButton />
              </Suspense>
            </div>
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
