import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-light/70 text-sm font-rounded">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-primary text-sm font-rounded font-medium">
          {Math.round(progress)}% complete
        </span>
      </div>
      <div className="w-full bg-light/10 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-primary to-emotional h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-light/60 text-sm mt-2 text-center">
        Complete your profile to unlock Vibe Match Mode! ✨
      </p>
    </div>
  );
};

export default ProgressBar;