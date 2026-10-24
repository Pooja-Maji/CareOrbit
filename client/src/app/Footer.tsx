import React from 'react';
import { Link } from 'react-router-dom';
import { COPY } from '../copy';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-plum-soft bg-white/60 py-8 px-4 text-center">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Clinician & Safety Disclaimer */}
        <p className="text-xs text-ink-muted leading-relaxed max-w-2xl mx-auto">
          <strong className="text-ink font-semibold">Important Notice: </strong>
          {COPY.nonDiagnosticDisclaimer}
        </p>

        <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-medium text-plum">
          <Link to="/about" className="hover:underline">Clinical Sources & Limits</Link>
          <span>•</span>
          <Link to="/emergency" className="text-emergency hover:underline font-semibold">Emergency Danger Signs</Link>
          <span>•</span>
          <a href="tel:108" className="hover:underline">Ambulance: 108</a>
          <span>•</span>
          <a href="tel:14416" className="hover:underline">Mental Health: 14416</a>
        </div>

        <p className="text-[11px] text-ink-subtle">
          SthreeCare Prototype • recHERsion'26 PS1 Women's Healthcare • Person A: Assess
        </p>
      </div>
    </footer>
  );
};
