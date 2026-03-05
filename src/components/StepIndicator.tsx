import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

const StepIndicator = ({ currentStep, steps }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isCompleted = currentStep > stepNum;
        const isActive = currentStep === stepNum;

        return (
          <div key={i} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-heading font-semibold transition-colors ${
                  isCompleted
                    ? "bg-success text-success-foreground"
                    : isActive
                    ? "bg-primary text-primary-foreground glow-primary"
                    : "bg-secondary text-muted-foreground"
                }`}
                animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : stepNum}
              </motion.div>
              <span className={`text-xs font-medium hidden sm:block ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 md:w-16 h-0.5 rounded-full mb-5 sm:mb-6 ${isCompleted ? "bg-success" : "bg-secondary"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
