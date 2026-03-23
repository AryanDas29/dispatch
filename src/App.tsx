import React, { useState, useEffect } from 'react';
import { crises as seedCrises } from './data/crises';
import { rankCrises } from './lib/rankCrises';
import { generateDailyBrief } from './lib/aiEngine';
import type { DailyBriefOutput } from './lib/aiEngine';
import type { UserProfile } from './types/profile';
import OnboardingModal from './components/OnboardingModal';
import ImpactBoard from './components/ImpactBoard';
import DailyBrief from './components/DailyBrief';
import CrisisFeed from './components/CrisisFeed';
import './index.css';

const dateStr = new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
});

const ORBS: [number, string, string, string, number][] = [
  [400, '-80px', '-60px',  '6s', 0.08],
  [250, '60px',  '55%',   '8s', 0.13],
  [180, '20px',  '30%',  '10s', 0.06],
];

function App() {
  const [rankedCrises]                   = useState(() => rankCrises(seedCrises));
  const [brief,        setBrief]         = useState<DailyBriefOutput | null>(null);
  const [briefLoading, setBriefLoading]  = useState(true);
  const [briefError,   setBriefError]    = useState<string | null>(null);
  const [scrollY,      setScrollY]       = useState(0);
  const [scrolled,     setScrolled]      = useState(false);
  const [profile,      setProfile]       = useState<UserProfile | null>(null);
  const [actionsCount, setActionsCount]  = useState(0);

  useEffect(() => {
    generateDailyBrief(rankedCrises)
      .then((result) => { setBrief(result); setBriefLoading(false); })
      .catch((err) => {
        console.error('Brief generation failed:', err);
        setBriefError('Intelligence brief unavailable. Check API key configuration.');
        setBriefLoading(false);
      });
  }, [rankedCrises]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      setScrolled(y > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f0faf4' }}>
      {/* Onboarding modal — shown until profile is set */}
      {profile === null && <OnboardingModal onComplete={setProfile} />}

      {/* Glassmorphism navbar */}
      <header style={{
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(34,197,94,0.15)',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.08)' : 'none',
        height: '64px',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'box-shadow 0.3s ease',
      }}>
        <span style={{
          fontSize: '18px',
          fontWeight: 800,
          color: '#15803d',
          letterSpacing: '0.08em',
          fontFamily: "'Syne', sans-serif",
        }}>
          🌍 DISPATCH
        </span>
        <span style={{ fontSize: '14px', color: '#64748b' }}>{dateStr}</span>
      </header>

      {/* Two-column body */}
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {/* Sidebar */}
        <aside style={{
          width: '280px',
          flexShrink: 0,
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          margin: '24px 0 24px 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          position: 'sticky',
          top: '88px',
        }}>
          <ImpactBoard crises={rankedCrises} actionsCount={actionsCount} />
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: '24px' }}>
          {/* Parallax hero wrapper */}
          <div style={{ position: 'relative', marginBottom: '8px' }}>
            {ORBS.map(([size, top, left, duration, speed], i) => (
              <div key={i} style={{ position: 'absolute', top, left, pointerEvents: 'none', zIndex: 0, transform: `translateY(${scrollY * speed}px)` }}>
                <div style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  borderRadius: '999px',
                  background: 'radial-gradient(circle, rgba(34,197,94,0.13) 0%, transparent 70%)',
                  animation: `float ${duration} ease-in-out infinite`,
                }} />
              </div>
            ))}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <DailyBrief
                brief={brief}
                loading={briefLoading}
                error={briefError}
                profile={profile}
                topCrisis={rankedCrises[0] ?? null}
              />
            </div>
          </div>

          <CrisisFeed
            crises={rankedCrises}
            onAction={() => setActionsCount((c) => c + 1)}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
