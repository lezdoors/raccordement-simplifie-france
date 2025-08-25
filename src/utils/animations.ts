// animations.js - Premium animations for Raccordement-Connect
// These animations work with your existing React + Tailwind setup

// 1. INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
export const initScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: stop observing after animation
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with fade-in-up class
  document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
  });
};

// 2. ANIMATED COUNTER FOR STATISTICS
export const animateCounter = (element: HTMLElement, target: number, duration = 2000) => {
  let start = 0;
  const increment = target / (duration / 16); // 60fps
  
  const updateCounter = () => {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start).toLocaleString('fr-FR');
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target.toLocaleString('fr-FR');
    }
  };
  
  updateCounter();
};

// 3. REACT HOOK FOR SCROLL ANIMATIONS
import { useEffect, useRef } from 'react';

export const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('visible');
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold]);

  return ref;
};

// 4. TAILWIND CLASS COMBINATIONS FOR YOUR COMPONENTS
export const classNames = {
  // Hero section
  heroSection: "hero-gradient-enhanced hero-pattern relative min-h-screen flex items-center justify-center overflow-hidden",
  
  // CTA Button
  ctaButton: "cta-button-premium px-8 py-4 rounded-lg font-semibold text-white text-lg inline-flex items-center gap-2",
  
  // Service Cards
  serviceCard: "service-card-enhanced fade-in-up cursor-pointer",
  
  // Contact Card
  contactCard: "contact-card-glass p-6 fade-in-up",
  
  // Form Inputs
  formGroup: "form-input-modern mb-6",
  
  // Statistics
  statContainer: "text-center fade-in-up",
  statNumber: "stat-number text-4xl font-bold text-blue-600",
  
  // Sections
  section: "section-padding",
};

// 5. SMOOTH SCROLL TO SECTION
export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};

// 6. ADD RIPPLE EFFECT TO BUTTONS
export const addRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.classList.add('ripple');

  button.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
};

// 7. PARALLAX EFFECT FOR HERO BACKGROUND
export const initParallax = () => {
  const heroElement = document.querySelector('.hero-gradient-enhanced') as HTMLElement;
  if (!heroElement) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = scrolled * 0.5;
    heroElement.style.transform = `translateY(${parallax}px)`;
  });
};

// 8. FORM VALIDATION ANIMATIONS
export const showValidationError = (inputElement: HTMLInputElement, message: string) => {
  const parent = inputElement.parentElement;
  if (!parent) return;
  
  parent.classList.add('shake-error');
  
  // Remove existing error message if any
  const existingError = parent.querySelector('.error-message');
  if (existingError) existingError.remove();
  
  // Add new error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message text-red-500 text-sm mt-1 fade-in-up visible';
  errorDiv.textContent = message;
  parent.appendChild(errorDiv);
  
  // Remove shake animation after completion
  setTimeout(() => {
    parent.classList.remove('shake-error');
  }, 500);
};

// 9. INITIALIZE ALL ANIMATIONS ON PAGE LOAD
export const initAllAnimations = () => {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    initScrollAnimations();
    initParallax();
    
    // Add ripple effect to all buttons
    document.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', (e) => addRipple(e as any));
    });
  }
};

// 10. STATISTICS ANIMATION HOOK
export const useCounterAnimation = (target: number, duration = 2000) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animateCounter(element, target, duration);
        observer.disconnect();
      }
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [target, duration]);

  return ref;
};