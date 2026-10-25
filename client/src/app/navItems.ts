import type { ComponentType } from 'react';
import {
  House,
  ClipboardList,
  FileText,
  Clock,
  MapPin,
  HandHeart,
  CalendarCheck,
} from '../design/ui/Icon';

export interface NavItem {
  to: string;
  label: string;
  hint: string;
  icon: ComponentType<{ className?: string }>;
  tone: 'plum' | 'teal' | 'coral' | 'amber';
}

/** One source of truth for every nav surface (header, drawer, footer tabs, dashboard tiles). */
export const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Home', hint: 'Your day at a glance', icon: House, tone: 'plum' },
  { to: '/assess', label: 'Health Check', hint: 'Start a new screening', icon: ClipboardList, tone: 'plum' },
  { to: '/profile', label: 'Reports', hint: 'Saved results & PDFs', icon: FileText, tone: 'teal' },
  { to: '/history', label: 'Timeline', hint: 'Track change over time', icon: Clock, tone: 'coral' },
  { to: '/find-care', label: 'Find Care', hint: 'Clinics & labs near you', icon: MapPin, tone: 'teal' },
  { to: '/support', label: 'Get Help', hint: 'Volunteer companions', icon: HandHeart, tone: 'coral' },
  { to: '/follow-up', label: 'Follow-ups', hint: 'Tests & next steps', icon: CalendarCheck, tone: 'amber' },
];

/** Five tabs that fit a phone footer. */
export const MOBILE_TABS = ['/dashboard', '/assess', '/profile', '/find-care', '/support'];
