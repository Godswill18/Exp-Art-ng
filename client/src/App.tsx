import { Suspense, lazy, useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

function LayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <Suspense fallback={null}>
        <CustomCursor />
      </Suspense>

      <Suspense fallback={<div className="h-20 bg-background" />}>
        <Navbar />
      </Suspense>

      {children}

      <Suspense fallback={null}>
        <WhatsAppButton />
      </Suspense>
    </div>
  );
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return (
      <Suspense fallback={<div className="fixed inset-0 bg-background" />}>
        <Preloader onComplete={() => setIsLoading(false)} />
      </Suspense>
    );
  }

  return (
    <LayoutWrapper>
      <main>
        <Suspense
          fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
              <div className="animate-pulse text-primary text-xl">Loading...</div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/art-tours" element={<ArtTours />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </LayoutWrapper>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
