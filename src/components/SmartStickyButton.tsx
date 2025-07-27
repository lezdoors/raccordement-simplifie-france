import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const SmartStickyButton = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [showMobileOnly, setShowMobileOnly] = useState(false);
  const navigate = useNavigate();

  const scrollToForm = () => {
    const formElement = document.getElementById('form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If no form on current page, navigate to form page
      navigate('/raccordement-enedis');
    }
  };

  useEffect(() => {
    const checkScrollPosition = () => {
      const formElement = document.getElementById('form');
      const heroSection = document.querySelector('section'); // First section is typically hero
      
      if (formElement) {
        const formRect = formElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Hide sticky button if form is visible or user has scrolled past it
        const formIsVisible = formRect.top < viewportHeight && formRect.bottom > 0;
        const passedForm = formRect.top < 0;
        
        setIsVisible(!(formIsVisible || passedForm));
      }

      // Check if we should show mobile-only behavior
      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        // Show mobile sticky only after scrolling past hero section
        setShowMobileOnly(heroRect.bottom < 0);
      }
    };

    // Check on mount
    checkScrollPosition();

    // Add scroll listener
    window.addEventListener('scroll', checkScrollPosition, { passive: true });
    window.addEventListener('resize', checkScrollPosition, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, []);

  // Only show on mobile if we've scrolled past hero and form is not visible
  if (window.innerWidth >= 768 || !isVisible || !showMobileOnly) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 transition-all duration-300">
      <Button 
        onClick={scrollToForm} 
        className="w-full font-bold px-6 py-4 rounded-xl text-[#1E1E1E] hover:opacity-90 transition-all duration-300 mobile-button shadow-2xl touch-feedback mobile-optimized" 
        size="lg"
        style={{ background: 'linear-gradient(90deg, #FFD77A 0%, #F2B736 100%)' }}
      >
        Démarrer ma demande
      </Button>
    </div>
  );
};