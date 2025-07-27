import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Step {
  id: string;
  title: string;
  completed: boolean;
}

interface MobileStepProgressProps {
  steps: Step[];
  currentStep: number;
  progress: number;
  className?: string;
}

export const MobileStepProgress: React.FC<MobileStepProgressProps> = ({
  steps,
  currentStep,
  progress,
  className = '',
}) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    // Return desktop version for non-mobile devices
    return (
      <div className={`hidden md:flex items-center justify-between ${className}`}>
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  index <= currentStep
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}
              >
                {step.completed ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700 mx-4">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{
                    width: index < currentStep ? '100%' : '0%',
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Mobile version
  return (
    <div className={`md:hidden ${className}`}>
      {/* Mobile Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(progress)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Current Step Info */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {steps[currentStep]?.completed ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs font-bold text-white">{currentStep + 1}</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {steps[currentStep]?.title || 'Loading...'}
            </h3>
          </div>
        </div>
      </motion.div>

      {/* Steps Overview (Collapsed) */}
      <div className="mt-4">
        <div className="flex items-center space-x-2">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                index < currentStep
                  ? 'bg-green-500'
                  : index === currentStep
                  ? 'bg-primary'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            />
          ))}
        </div>
        
        {/* Steps Labels */}
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`text-xs text-center flex-1 ${
                index === currentStep
                  ? 'text-primary font-medium'
                  : index < currentStep
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {step.completed ? (
                <CheckCircle className="w-3 h-3 mx-auto" />
              ) : (
                <Circle className="w-3 h-3 mx-auto" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};