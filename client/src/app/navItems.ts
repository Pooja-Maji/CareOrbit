import type { ComponentType } from 'react';
import {
  House,
  ClipboardList,
  User,
  Clock,
  MapPin,
  HandHeart,
  CalendarCheck,
  Coins,
} from '../design/ui/Icon';

export type NavGroup = 'home' | 'start' | 'after' | 'support';

export interface NavItem {
  to: string;
  label: string;
  hint: string;
  icon: ComponentType<{ className?: string }>;
  tone: 'plum' | 'teal' | 'coral' | 'amber';
  group: NavGroup;
  /** Position in the suggested journey (Home has none). */
  step?: number;
}

export const NAV_GROUPS: { id: NavGroup; title: string }[] = [
  { id: 'home', title: '' },
  { id: 'start', title: 'Start here' },
  { id: 'after', title: 'After your check' },
  { id: 'support', title: 'Support & community' },
];

/**
 * ONE ordered list = the menu. It is listed only in the hamburger drawer
 * (plus 5 thumb tabs on phones) — not repeated in the header or on Home.
 * Order = the path we want a new person to follow.
 */
export const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Home', hint: 'Your day at a glance', icon: House, tone: 'plum', group: 'home' },
  { to: '/profile', label: 'Profile & Reports', hint: 'Your details, saved reports, privacy', icon: User, tone: 'plum', group: 'start', step: 1 },
  { to: '/assess', label: 'Health Check', hint: 'Start a new screening', icon: ClipboardList, tone: 'plum', group: 'start', step: 2 },
  { to: '/history', label: 'Timeline', hint: 'Track change over time', icon: Clock, tone: 'coral', group: 'after', step: 3 },
  { to: '/find-care', label: 'Find Care', hint: 'Clinics & labs near you', icon: MapPin, tone: 'teal', group: 'after', step: 4 },
  { to: '/follow-up', label: 'Follow-ups', hint: 'Tests & next steps', icon: CalendarCheck, tone: 'amber', group: 'after', step: 5 },
  { to: '/support', label: 'Get Help', hint: 'Volunteer companions', icon: HandHeart, tone: 'coral', group: 'support', step: 6 },
  { to: '/time-bank', label: 'Time Bank', hint: 'Earn & use credits', icon: Coins, tone: 'teal', group: 'support', step: 7 },
];

/** Five thumb tabs for phones, in this order. */
export const MOBILE_TABS = ['/dashboard', '/assess', '/find-care', '/support', '/profile'];
