/**
 * SthreeCare - Task Stepper
 * Owner: Person B (Stage 11)
 * 
 * Signature Visual: Stepper drawn along the signature plum thread.
 * State machine progression: Requested -> Matched -> In progress -> Verified.
 */

import React from 'react';
import type { SupportTaskStatus } from '@sthreecare/shared';
import { CheckCircle, Clock, Shield, Sparkles } from '../../design/ui/Icon';

interface TaskStepperProps {
  currentStatus: SupportTaskStatus;
  onAdvanceStatus?: (nextStatus: SupportTaskStatus) => void;
}

export const TaskStepper: React.FC<TaskStepperProps> = ({
  currentStatus,
  onAdvanceStatus,
}) => {
  const steps: { key: SupportTaskStatus; label: string; desc: string }[] = [
    { key: 'requested', label: 'Requested', desc: 'Dispatched with anonymous reference' },
    { key: 'matched', label: 'Matched', desc: 'Verified local health volunteer assigned' },
    { key: 'in_progress', label: 'In Progress', desc: 'Accompaniment / navigation underway' },
    { key: 'verified', label: 'Verified', desc: 'Task completed & credits recorded' },
  ];

  const statusOrder: SupportTaskStatus[] = ['requested', 'matched', 'in_progress', 'verified'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="py-4 space-y-4">
      {/* Thread line and steps */}
      <div className="relative">
        {/* Horizontal Connector Thread */}
        <div className="absolute top-5 left-8 right-8 h-[3px] bg-plum-soft -translate-y-1/2 z-0 hidden sm:block" />
        <div
          className="absolute top-5 left-8 h-[3px] bg-plum -translate-y-1/2 z-0 transition-all duration-500 hidden sm:block"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 80}%` }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
          {steps.map((step, idx) => {
            const isDone = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isPending = idx > currentIndex;

            return (
              <div
                key={step.key}
                className={`flex sm:flex-col items-center sm:items-center text-left sm:text-center gap-3 sm:gap-2 p-2 rounded-xl transition-all ${
                  isCurrent ? 'bg-plum-soft/40 sm:bg-transparent' : ''
                }`}
              >
                {/* Node */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-transform ${
                    isDone
                      ? 'bg-teal text-white border-teal shadow-soft'
                      : isCurrent
                      ? 'bg-plum text-white border-plum ring-4 ring-plum/20 scale-110 shadow-soft animate-pulse'
                      : 'bg-white text-ink-subtle border-plum-soft'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                <div>
                  <h4
                    className={`font-heading font-semibold text-xs sm:text-sm ${
                      isCurrent ? 'text-plum font-bold' : isDone ? 'text-teal' : 'text-ink-subtle'
                    }`}
                  >
                    {step.label}
                  </h4>
                  <p className="text-[10px] text-ink-muted leading-tight mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Demo Simulation Status Advancer Button */}
      {onAdvanceStatus && currentIndex < steps.length - 1 && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => onAdvanceStatus(statusOrder[currentIndex + 1])}
            className="text-xs font-semibold text-plum hover:underline inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-plum-soft/60"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate next step: Advance to "{steps[currentIndex + 1].label}"</span>
          </button>
        </div>
      )}
    </div>
  );
};
