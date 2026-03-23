import React, { useState } from 'react';
import type { UserProfile } from '../types/profile';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

const SKILLS   = ['🏥 Medical', '💻 Tech', '🌍 Languages', '📦 Logistics', '📢 Advocacy'];
const TIME     = ['⚡ 5 mins', '🕐 1 hour', '📅 Ongoing'];
const LOCATION = ['🇺🇸 Americas', '🌍 Europe/Africa', '🌏 Asia/Pacific'];

function PillGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <p style={{
        fontSize: '13px',
        fontWeight: 600,
        color: '#0f172a',
        marginBottom: '10px',
      }}>
        {label}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                border: `1.5px solid ${active ? '#22c55e' : '#dcfce7'}`,
                background: active ? '#22c55e' : '#f0faf4',
                color: active ? '#ffffff' : '#15803d',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function toggle(arr: string[], value: string): string[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

const OnboardingModal: React.FC<Props> = ({ onComplete }) => {
  const [skills,   setSkills]   = useState<string[]>([]);
  const [time,     setTime]     = useState<string[]>([]);
  const [location, setLocation] = useState<string[]>([]);
  const [btnHover, setBtnHover] = useState(false);

  const handleSubmit = () => {
    onComplete({ skills, time, location });
  };

  return (
    /* Overlay */
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '24px',
    }}>
      {/* Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        padding: '40px',
        maxWidth: '480px',
        width: '100%',
        boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
        animation: 'fadeSlideIn 0.4s ease forwards',
      }}>
        {/* Header */}
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '28px',
          fontWeight: 800,
          color: '#0f172a',
          margin: '0 0 8px 0',
        }}>
          Who are you?
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#64748b',
          lineHeight: 1.6,
          margin: '0 0 32px 0',
        }}>
          Dispatch personalizes your action feed based on your profile.
        </p>

        <PillGroup
          label="Your skills"
          options={SKILLS}
          selected={skills}
          onToggle={(v) => setSkills(toggle(skills, v))}
        />
        <PillGroup
          label="Your time"
          options={TIME}
          selected={time}
          onToggle={(v) => setTime(toggle(time, v))}
        />
        <PillGroup
          label="Your location"
          options={LOCATION}
          selected={location}
          onToggle={(v) => setLocation(toggle(location, v))}
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            width: '100%',
            padding: '14px',
            background: btnHover ? '#15803d' : '#22c55e',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
        >
          Get My Dispatch →
        </button>
      </div>
    </div>
  );
};

export default OnboardingModal;
