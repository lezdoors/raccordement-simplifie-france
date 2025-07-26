import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Step {
  id: number;
  title: string;
  completed?: boolean;
}

interface MobileFormProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  progress: number;
}

export const MobileFormProgressIndicator = ({ 
  steps, 
  currentStep, 
  progress 
}: MobileFormProgressIndicatorProps) => {
  return (
    <div className="w-full space-y-4">
      {/* Progress Bar */}
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        
        {/* Step indicators */}
        <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center
                ${step.id <= currentStep 
                  ? 'bg-primary border-primary text-white' 
                  : 'bg-white border-gray-300 text-gray-400'
                }
              `}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {step.id < currentStep ? (
                <Check className="w-3 h-3" />
              ) : (
                <span className="text-xs font-bold">{step.id}</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Current Step Info */}
      <motion.div 
        className="text-center"
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-sm font-medium text-foreground">
          {steps[currentStep - 1]?.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Étape {currentStep} sur {steps.length}
        </p>
      </motion.div>
    </div>
  );
};