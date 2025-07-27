import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, Phone, MessageCircle, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileFloatingActionsProps {
  onScrollToTop?: () => void;
  onContactCall?: () => void;
  onContactMessage?: () => void;
  showScrollToTop?: boolean;
  showContactActions?: boolean;
  className?: string;
}

export const MobileFloatingActions: React.FC<MobileFloatingActionsProps> = ({
  onScrollToTop,
  onContactCall,
  onContactMessage,
  showScrollToTop = true,
  showContactActions = true,
  className = '',
}) => {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    if (!isMobile || !showScrollToTop) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollButton(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, showScrollToTop]);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    onScrollToTop?.();
  };

  const handleContactCall = () => {
    window.location.href = 'tel:0970709570';
    onContactCall?.();
  };

  const handleContactMessage = () => {
    // Navigate to contact form or open messaging
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    onContactMessage?.();
  };

  if (!isMobile) {
    return null;
  }

  const actions = [
    {
      id: 'call',
      icon: Phone,
      label: 'Appeler',
      onClick: handleContactCall,
      className: 'bg-green-500 hover:bg-green-600 text-white',
      show: showContactActions,
    },
    {
      id: 'message',
      icon: MessageCircle,
      label: 'Message',
      onClick: handleContactMessage,
      className: 'bg-blue-500 hover:bg-blue-600 text-white',
      show: showContactActions,
    },
    {
      id: 'scroll',
      icon: ArrowUp,
      label: 'Haut',
      onClick: handleScrollToTop,
      className: 'bg-gray-600 hover:bg-gray-700 text-white',
      show: showScrollButton,
    },
  ].filter(action => action.show);

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <AnimatePresence>
        {/* Expanded Actions */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col-reverse space-y-3 space-y-reverse mb-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  onClick={() => {
                    action.onClick();
                    setIsExpanded(false);
                  }}
                  className={`w-12 h-12 rounded-full shadow-lg ${action.className} touch-feedback`}
                  size="sm"
                  aria-label={action.label}
                >
                  <action.icon className="w-5 h-5" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Main Toggle Button */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`w-14 h-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 text-white touch-feedback ${
              isExpanded ? 'rotate-45' : ''
            } transition-transform duration-200`}
            size="sm"
            aria-label={isExpanded ? 'Fermer les actions' : 'Ouvrir les actions'}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronUp className="w-6 h-6" />
            </motion.div>
          </Button>

          {/* Badge for notification */}
          {showContactActions && !isExpanded && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
            >
              <span className="text-xs text-white font-bold">
                {actions.length}
              </span>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Backdrop for expanded state */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 -z-10"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};