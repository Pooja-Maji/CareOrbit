import React from 'react';

export interface ProgressStep {
  id: string;
  label: string;
  description?: string;
  completed: boolean;
  current: boolean;
}

export interface ProgressThreadProps {
  steps: ProgressStep[];
  onStepClick?: (stepId: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

export const ProgressThread: React.FC<ProgressThreadProps> = ({
  steps,
  onStepClick,
  orientation = 'horizontal',
}) => {
  if (orientation === 'vertical') {
    return (
      <div className="relative pl-8 py-2">
        {/* Continuous thread line */}
        <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-gradient-to-b from-teal via-teal to-teal opacity-40" />

        <div className="space-y-6">
          {steps.map((step) => {
            let dotClasses = 'bg-white border-2 border-plum-soft text-ink-subtle';
            if (step.completed) {
              dotClasses = 'bg-teal border-2 border-teal text-white';
            } else if (step.current) {
              dotClasses = 'bg-plum border-2 border-plum text-white ring-4 ring-plum-soft';
            }

            return (
              <div
                key={step.id}
                onClick={() => onStepClick && onStepClick(step.id)}
                className={`relative flex items-start gap-4 ${
                  onStepClick ? 'cursor-pointer' : ''
                }`}
              >
                {/* Node on thread */}
                <div
                  className={`absolute -left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${dotClasses}`}
                >
                  {step.completed ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>•</span>
                  )}
                </div>

                <div>
                  <p className={`text-sm font-semibold ${step.current ? 'text-plum' : 'text-ink'}`}>
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-ink-muted mt-0.5">{step.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Horizontal thread
  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        {/* Continuous horizontal thread */}
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-teal via-teal to-teal opacity-30 z-0" />

        {steps.map((step, idx) => {
          let dotClasses = 'bg-white border-2 border-plum-soft text-ink-subtle';
          if (step.completed) {
            dotClasses = 'bg-teal border-2 border-teal text-white';
          } else if (step.current) {
            dotClasses = 'bg-plum border-2 border-plum text-white ring-4 ring-plum-soft';
          }

          return (
            <div
              key={step.id}
              onClick={() => onStepClick && onStepClick(step.id)}
              className="relative z-10 flex flex-col items-center group cursor-pointer"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-transform duration-200 group-hover:scale-110 ${dotClasses}`}
              >
                {step.completed ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span
                className={`text-xs mt-2 font-medium max-w-[80px] text-center truncate ${
                  step.current ? 'text-plum font-semibold' : 'text-ink-muted'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
