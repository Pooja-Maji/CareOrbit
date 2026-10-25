/**
 * SthreeCare - Home
 * Layout follows the approved homepage design:
 * hero → quick access → life stages → validated tools / community → trust strip → CTA.
 * A "Your health at a glance" block (today, trends, backup) appears only once the person has data.
 */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { TodayCard } from './TodayCard';
import { TrendStrip } from './TrendStrip';
import { StageSummary } from './StageSummary';
import { BackupPrompt } from './BackupPrompt';
import { StorageNotice } from './StorageNotice';
import { Sprig } from '../home/Sprig';
import {
  ArrowRight,
  Check,
  Compass,
  CalendarCheck,
  FileText,
  Heart,
  HeartPulse,
  Shield,
  Users,
} from '../../design/ui/Icon';
import { getAllResultsFromDb } from '../../db/historyRepo';
import { getAllFollowUpsFromDb, updateFollowUpStatus } from '../../db/followUpRepo';
import type { ExtendedFollowUp } from '../../db/schema';
import type { Result } from '@sthreecare/shared';
import { useUiStore } from '../../state/uiStore';

/* ---------- small shared pieces ---------- */

const HEAD = 'text-[#3A1F66] dark:text-ink';
const MUTED = 'text-[#5E5478] dark:text-ink-muted';

const Eyebrow: React.FC<{ children: React.ReactNode; tone?: 'pink' | 'violet' }> = ({ children, tone = 'pink' }) => (
  <p className={`text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] ${tone === 'pink' ? 'text-[#D6579B]' : 'text-[#7B5CC4] dark:text-[#C4B5FD]'}`}>
    {children}
  </p>
);

const OutlineLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link
    to={to}
    className="inline-flex items-center gap-2 h-12 px-6 rounded-full border-2 border-[#4B2A7B] text-[#4B2A7B] dark:border-[#C4B5FD] dark:text-[#C4B5FD] text-sm font-semibold hover:bg-[#4B2A7B] hover:text-white dark:hover:bg-[#C4B5FD] dark:hover:text-[#2B1B4D] transition-colors"
  >
    {children} <ArrowRight className="w-4 h-4" />
  </Link>
);

/* ---------- content ---------- */

const QUICK_ACCESS = [
  { to: '/assess', title: 'Health Check', desc: 'Quick, validated screenings for your life stage.', icon: HeartPulse, pink: true },
  { to: '/profile', title: 'My Reports', desc: 'View your results, track your progress, save to your history.', icon: FileText, pink: false },
  { to: '/follow-up', title: 'Screening Reminders', desc: 'Never miss important checks and follow-ups.', icon: CalendarCheck, pink: true },
  { to: '/find-care', title: 'Care Navigation', desc: 'Get clear next steps — from doctor visits to nearby care.', icon: Compass, pink: false },
  { to: '/time-bank', title: 'Healthcare Time Bank', desc: 'Verified community support for practical help, when you need it.', icon: Users, pink: true },
];

const LIFE_STAGES = [
  { label: 'Adolescence', desc: 'Build healthy habits early', img: '/home/stage-adolescence.jpg' },
  { label: 'Reproductive Years', desc: 'Understand your cycle and fertility', img: '/home/stage-reproductive.jpg' },
  { label: 'Pregnancy', desc: 'Support for you and your baby', img: '/home/stage-pregnancy.jpg' },
  { label: 'Menopause', desc: 'Embrace change with confidence', img: '/home/stage-menopause.jpg' },
];

const TRUST = [
  { icon: Shield, label: 'Validated Screenings' },
  { icon: Users, label: 'Trusted Community Support' },
  { icon: Heart, label: 'Continuity of Care' },
];

/** The "Source-backed" phone + checklist graphic, drawn in HTML so it stays sharp and themes properly. */
const ValidatedGraphic: React.FC = () => (
  <div className="relative w-[260px] h-[230px] flex-shrink-0 mx-auto" aria-hidden="true">
    <span className="absolute left-3 top-4 w-[200px] h-[200px] rounded-[44px] bg-[#E8DFF9] dark:bg-plum/25" />
    <div className="absolute left-9 top-2 w-[150px] h-[190px] rounded-[28px] bg-[#EFE9FB] dark:bg-plum/30 border border-white/70 dark:border-plum/30" />
    <span className="absolute left-[46px] top-[26px] px-3 py-1 rounded-full bg-[#8E78D6] text-white text-[11px] font-semibold shadow-soft">
      Source-backed
    </span>
    <Sprig className="absolute right-0 top-0 w-16 h-24 text-[#BDAEEA] dark:text-plum-light/70" />
    <div className="absolute left-0 bottom-3 w-[232px] rounded-2xl bg-white shadow-soft p-4 space-y-3">
      {['Validated instruments', 'Published thresholds', 'Clear next steps'].map((t) => (
        <div key={t} className="flex items-center gap-3 text-[13px] text-[#5E5478] dark:text-ink-muted">
          <Check className="w-4 h-4 text-[#6B4FC0] dark:text-[#C4B5FD] flex-shrink-0" strokeWidth={2.6} />
          {t}
        </div>
      ))}
    </div>
    <svg className="absolute right-3 bottom-0 w-14 h-16 drop-shadow" viewBox="0 0 56 64" fill="none">
      <path d="M28 2 52 11v18c0 16-10 27-24 33C14 56 4 45 4 29V11L28 2Z" fill="#9A86DC" />
      <path d="m18 32 7 7 14-15" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

/* ---------- screen ---------- */

export const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { profile, result, history } = useAppStore();
  const { showToast } = useUiStore();

  const [dbResults, setDbResults] = useState<Result[]>(history);
  const [followUps, setFollowUps] = useState<ExtendedFollowUp[]>([]);

  const loadData = async () => {
    try {
      const [resList, folList] = await Promise.all([getAllResultsFromDb(), getAllFollowUpsFromDb()]);
      setDbResults(resList.length > 0 ? resList : history);
      setFollowUps(folList);
    } catch (e) {
      console.warn('Error loading dashboard data', e);
    }
  };

  useEffect(() => {
    loadData();
  }, [history]);

  const handleMarkFollowUpDone = async (id: string) => {
    await updateFollowUpStatus(id, 'done');
    await loadData();
    showToast({ type: 'success', title: 'Done', message: 'Follow-up marked complete.' });
  };

  const latestResult = dbResults[0] || result || null;
  const openFollowUps = followUps.filter((f) => f.status === 'open');
  const activeFollowUp = openFollowUps[0] || null;
  const hasPersonalData = dbResults.length > 0 || openFollowUps.length > 0;

  return (
    <div className="pb-4">
      {/* HERO — full-bleed, breaks out of the shell padding */}
      <section className="home-hero relative overflow-hidden -mx-4 sm:-mx-6 lg:-mx-10 -mt-6 lg:h-[380px] xl:h-[440px] 2xl:h-[480px]">
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 pt-10 pb-4 lg:py-0 lg:h-full flex items-center">
          <div className="max-w-[480px] space-y-5">
            <Eyebrow>Your health. Our priority</Eyebrow>
            <h1 className="font-heading font-semibold text-[2.4rem] sm:text-5xl xl:text-[3.4rem] leading-[1.08] text-[#3A1F66]">
              Healthy Women
              <br className="hidden sm:block" /> Build Healthier
              <br className="hidden sm:block" /> Tomorrows
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-[#4A3F66] max-w-[420px] lg:max-w-[340px] xl:max-w-[420px]">
              Validated screening tools, clear guidance, and trusted support — at every stage of your life.
            </p>
            <button
              type="button"
              onClick={() => navigate('/assess')}
              className="inline-flex items-center gap-3 h-14 px-8 rounded-full bg-[#4B2A7B] text-white font-semibold shadow-lifted hover:bg-[#3D2163] hover:-translate-y-0.5 transition-all"
            >
              Start your health journey <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <img
          src="/home/hero.jpg"
          alt="A smiling woman resting her chin on her hand"
          className="home-fade-left block w-full h-auto mt-2 lg:mt-0 lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-auto lg:max-w-[64%] lg:object-cover lg:object-left"
        />
      </section>

      <div className="max-w-[1200px] mx-auto space-y-8 pt-10">
        {/* QUICK ACCESS */}
        <section className="space-y-5">
          <div className="space-y-2">
            <Eyebrow>Quick access</Eyebrow>
            <h2 className={`font-heading font-semibold text-3xl sm:text-[2rem] ${HEAD}`}>Your Health, Made Simple</h2>
            <p className={`text-sm sm:text-base ${MUTED}`}>Take the next step with our easy-to-use tools and resources.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 stagger">
            {QUICK_ACCESS.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className={`tile group flex flex-col min-h-[196px] p-5 rounded-3xl ${c.pink ? 'home-pink' : 'home-lav'}`}
              >
                <span
                  className={`tile-icon w-14 h-14 rounded-full flex items-center justify-center ${
                    c.pink ? 'bg-[#FAD6E6] text-[#D6579B] dark:bg-teal/25 dark:text-teal-dark' : 'bg-[#E4DAFA] text-[#6B4FC0] dark:bg-plum/30 dark:text-[#C4B5FD]'
                  }`}
                >
                  <c.icon className="w-6 h-6" />
                </span>
                <h3 className={`mt-4 font-heading font-semibold text-[17px] leading-snug ${HEAD}`}>{c.title}</h3>
                <p className={`mt-1.5 text-[13px] leading-relaxed ${MUTED}`}>{c.desc}</p>
                <ArrowRight className="mt-auto pt-2 w-5 h-5 self-end text-[#5B3FA8] dark:text-[#C4B5FD] transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>

        {/* LIFE STAGES */}
        <section className="home-stage rounded-3xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] gap-8 items-center">
          <div className="space-y-4">
            <Eyebrow>For every life stage</Eyebrow>
            <h2 className={`font-heading font-semibold text-3xl sm:text-4xl leading-tight ${HEAD}`}>
              Personalised Care
              <br className="hidden sm:block" /> for Every Chapter
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed max-w-[360px] ${MUTED}`}>
              From menstruation to menopause, our tools and guidance adapt to your unique needs at every stage of life.
            </p>
            <OutlineLink to="/profile">Explore life stages</OutlineLink>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4">
            {LIFE_STAGES.map((s, i) => (
              <div key={s.label} className="text-center px-1">
                <img src={s.img} alt="" className="home-fade-round w-full max-w-[150px] mx-auto" loading="lazy" />
                <div className="relative h-4 flex items-center justify-center">
                  <span
                    className={`hidden sm:block absolute top-1/2 border-t-2 border-dotted border-[#EFA3C6] ${
                      i === 0 ? 'left-1/2 right-0' : i === LIFE_STAGES.length - 1 ? 'left-0 right-1/2' : 'inset-x-0'
                    }`}
                  />
                  <span className="relative w-2 h-2 rounded-full bg-[#E56CA5]" />
                </div>
                <div className={`mt-2 text-sm font-semibold ${HEAD}`}>{s.label}</div>
                <div className={`text-xs leading-snug mt-0.5 ${MUTED}`}>{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* VALIDATED TOOLS + COMMUNITY */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="home-lav rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="space-y-4 flex-1 min-w-0">
              <Eyebrow tone="violet">Trusted &amp; evidence-based</Eyebrow>
              <h2 className={`font-heading font-semibold text-3xl leading-tight ${HEAD}`}>
                Validated Tools.
                <br /> Real Guidance.
              </h2>
              <p className={`text-sm leading-relaxed ${MUTED}`}>
                Our screening tools use proven instruments and published thresholds. Every result comes with clear sources and next steps — never a diagnosis.
              </p>
              <OutlineLink to="/about">How it works</OutlineLink>
            </div>
            <ValidatedGraphic />
          </div>

          <div className="home-pink-card rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="space-y-4 flex-1 min-w-0">
              <Eyebrow tone="violet">A stronger community</Eyebrow>
              <h2 className={`font-heading font-semibold text-3xl leading-tight ${HEAD}`}>
                Support Beyond
                <br /> the App
              </h2>
              <p className={`text-sm leading-relaxed ${MUTED}`}>
                Need help with appointments, transport, or practical support? Our verified volunteers are here through the Healthcare Time Bank.
              </p>
              <OutlineLink to="/time-bank">Learn more</OutlineLink>
            </div>
            <img src="/home/community.jpg" alt="" className="home-fade-round w-[210px] flex-shrink-0 mx-auto" loading="lazy" />
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="home-trust rounded-2xl px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-5">
          <p className={`font-heading font-semibold text-xl sm:text-[22px] leading-snug text-center md:text-left ${HEAD}`}>
            Better awareness. Earlier action.
            <br className="hidden md:block" /> Healthier futures.
          </p>
          <ul className="flex flex-wrap justify-center md:flex-nowrap md:divide-x divide-[#D9CFF1] dark:divide-plum/25">
            {TRUST.map((t) => (
              <li key={t.label} className="flex items-center gap-3 px-5 first:pl-0 last:pr-0 py-1">
                <span className="w-12 h-12 rounded-full bg-white/80 dark:bg-plum/25 flex items-center justify-center text-[#4B2A7B] dark:text-[#C4B5FD] flex-shrink-0">
                  <t.icon className="w-5 h-5" />
                </span>
                <span className={`text-xs leading-tight max-w-[90px] ${MUTED}`}>{t.label}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* PERSONAL SNAPSHOT — only once there is something to show */}
        {hasPersonalData && (
          <section className="space-y-4">
            <h2 className={`font-heading font-semibold text-2xl ${HEAD}`}>Your health at a glance</h2>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              <div className="xl:col-span-7 space-y-6">
                <TodayCard latestResult={latestResult} pendingFollowUp={activeFollowUp} onMarkFollowUpDone={handleMarkFollowUpDone} />
                <TrendStrip history={dbResults} isPregnant={profile.isPregnant} />
              </div>
              <div className="xl:col-span-5 space-y-6">
                <StageSummary profile={profile} />
                <BackupPrompt />
                <StorageNotice />
              </div>
            </div>
          </section>
        )}

        {/* CTA BAND */}
        <section className="home-cta relative overflow-hidden rounded-2xl px-6 sm:px-14 py-7 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <Sprig className="hidden sm:block absolute left-3 bottom-0 w-14 h-24 text-white/30" />
          <Sprig className="hidden sm:block absolute right-3 bottom-0 w-14 h-24 text-white/30" />
          <div className="relative space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">Your health journey starts here</p>
            <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-white">Take charge of your health today</h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/assess')}
            className="relative sm:mr-8 inline-flex items-center gap-2 h-12 px-7 rounded-full bg-[#FDCFD6] text-[#3A1F66] text-sm font-semibold shadow-lifted hover:bg-[#FBBFC9] hover:-translate-y-0.5 transition-all"
          >
            Start health check <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      </div>
    </div>
  );
};
