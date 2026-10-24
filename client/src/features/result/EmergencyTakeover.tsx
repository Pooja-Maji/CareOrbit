import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneCall, AlertTriangle, Shield, Heart } from '../../design/ui/Icon';
import { Button } from '../../design/ui/Button';
import { Card } from '../../design/ui/Card';

export const EmergencyTakeover: React.FC = () => {
  const navigate = useNavigate();
  const [familyAlerted, setFamilyAlerted] = useState(false);

  const handleAlertFamily = () => {
    setFamilyAlerted(true);
    // In real use, triggers local SMS or shared emergency contact alert
    setTimeout(() => {
      alert("Emergency SMS notification simulated: 'SthreeCare Alert: Urgent clinical danger sign recorded. Please check on me immediately.'");
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#8C1D18] text-white overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center animate-fade-in">
      <div className="max-w-xl w-full bg-[#B3261E] border-2 border-white/20 rounded-[24px] p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        {/* Pulsing Emergency Icon */}
        <div className="w-20 h-20 rounded-full bg-white text-emergency mx-auto flex items-center justify-center shadow-lifted animate-pulse">
          <AlertTriangle className="w-10 h-10 stroke-[2.5]" />
        </div>

        {/* Urgent Alert Heading */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-red-200 bg-white/10 px-3 py-1 rounded-full">
            Clinical Danger Sign Detected
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
            Immediate Emergency Medical Care Required
          </h1>
          <p className="text-sm text-red-100 leading-relaxed max-w-md mx-auto">
            Your screening answers or symptoms indicate an urgent medical situation. Please do not wait or travel alone.
          </p>
        </div>

        {/* Primary Action: Direct Call 108 */}
        <div className="pt-2 space-y-3">
          <a
            href="tel:108"
            className="w-full min-h-[64px] bg-white text-emergency-dark hover:bg-red-50 text-xl font-bold rounded-full shadow-2xl flex items-center justify-center gap-3 active:scale-98 transition-all"
          >
            <PhoneCall className="w-6 h-6 animate-bounce" />
            <span>Call Ambulance (108) Now</span>
          </a>

          {/* Mental Health Crisis Support if relevant */}
          <a
            href="tel:14416"
            className="w-full min-h-[48px] bg-red-950/40 hover:bg-red-950/60 border border-white/20 text-white text-sm font-semibold rounded-full flex items-center justify-center gap-2 transition-all"
          >
            <Heart className="w-4 h-4 text-red-200" />
            <span>Tele-MANAS Mental Health Helpline (14416)</span>
          </a>
        </div>

        {/* Secondary Action: Family Alert */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleAlertFamily}
            className={`w-full py-3.5 px-4 rounded-xl border border-white/30 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              familyAlerted
                ? 'bg-white/20 text-white'
                : 'bg-transparent hover:bg-white/10 text-white'
            }`}
          >
            <span>🚨</span>
            <span>{familyAlerted ? 'Emergency Alert Sent to Family Contact' : 'Alert My Emergency Family Contact'}</span>
          </button>
        </div>

        {/* Danger signs explanation */}
        <div className="p-4 rounded-xl bg-black/20 text-left space-y-2 text-xs text-red-100">
          <span className="font-semibold text-white block">Key Danger Signs Requiring Immediate Hospital Evaluation:</span>
          <ul className="list-disc list-inside space-y-1">
            <li>Soaking &gt;2 large pads per hour for 2 consecutive hours</li>
            <li>Sudden, excruciating pelvic pain or fainting</li>
            <li>High fever accompanied by pelvic tenderness or foul discharge</li>
            <li>Active urge to harm yourself or your baby</li>
          </ul>
        </div>

        {/* Never gated notice */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-red-200">
          <Shield className="w-3.5 h-3.5" />
          <span>Emergency help is 100% free and never gated by credits, login, or steps.</span>
        </div>

        {/* Dismiss / Return button for accidental triggers */}
        <div className="pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => navigate('/assess')}
            className="text-xs text-red-200 hover:text-white underline"
          >
            Return to assessment if opened by mistake
          </button>
        </div>
      </div>
    </div>
  );
};
