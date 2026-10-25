/**
 * Care Orbit - Today Card
 * One next best step instead of a wall of widgets.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../design/ui/Card';
import { Button } from '../../design/ui/Button';
import { Calendar, ArrowRight, CheckCircle, Sparkles, AlertTriangle, MapPin, HandHeart, ClipboardList } from '../../design/ui/Icon';
import type { Result, FollowUp } from '@sthreecare/shared';

interface TodayCardProps {
  latestResult: Result | null;
  pendingFollowUp: FollowUp | null;
  onMarkFollowUpDone?: (id: string) => void;
}

const Tag: React.FC<{ icon: React.ReactNode; text: string; cls: string }> = ({ icon, text, cls }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${cls}`}>
    {icon}
    {text}
  </span>
);

export const TodayCard: React.FC<TodayCardProps> = ({ latestResult, pendingFollowUp, onMarkFollowUpDone }) => {
  const navigate = useNavigate();

  if (pendingFollowUp && pendingFollowUp.status === 'open') {
    return (
      <Card variant="plumSoft" padding="lg" interactive className="border-2 border-plum/25 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-plum/10 rounded-full animate-blob pointer-events-none" />
        <div className="relative space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Tag icon={<Sparkles className="w-3.5 h-3.5" />} text="Do this next" cls="bg-plum" />
            {pendingFollowUp.dueDate && (
              <span className="text-xs text-ink-muted flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {pendingFollowUp.dueDate}
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-heading font-bold text-ink">{pendingFollowUp.step}</h3>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => navigate('/find-care')} icon={<MapPin className="w-4 h-4" />}>
              Find clinic
            </Button>
            <Button size="sm" variant="teal" onClick={() => navigate('/support')} icon={<HandHeart className="w-4 h-4" />}>
              Get help
            </Button>
            {onMarkFollowUpDone && (
              <Button size="sm" variant="ghost" onClick={() => onMarkFollowUpDone(pendingFollowUp.id)} icon={<CheckCircle className="w-4 h-4 text-teal" />}>
                Done
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  const topFlag = latestResult?.flags?.[0];
  if (topFlag) {
    return (
      <Card variant="coral" padding="lg" interactive className="space-y-4">
        <Tag icon={<AlertTriangle className="w-3.5 h-3.5" />} text="Needs attention" cls="bg-coral" />
        <div>
          <h3 className="text-xl sm:text-2xl font-heading font-bold text-ink">{topFlag.title}</h3>
          <p className="text-sm text-ink-muted mt-1 line-clamp-2">{topFlag.nextStep}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => navigate('/result')} icon={<ArrowRight className="w-4 h-4" />}>
            See results
          </Button>
          <Button size="sm" variant="secondary" onClick={() => navigate('/support')} icon={<HandHeart className="w-4 h-4" />}>
            Get help booking
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg" interactive className="space-y-4">
      <Tag icon={<CheckCircle className="w-3.5 h-3.5" />} text="All up to date" cls="bg-teal" />
      <h3 className="text-xl sm:text-2xl font-heading font-bold text-ink">Ready for your next check?</h3>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => navigate('/assess')} icon={<ClipboardList className="w-4 h-4" />}>
          Start check
        </Button>
        <Button size="sm" variant="secondary" onClick={() => navigate('/history')}>
          Timeline
        </Button>
      </div>
    </Card>
  );
};
