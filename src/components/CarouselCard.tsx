import React, { useState, useEffect } from 'react';
import type { Crisis, OrgEntry } from '../data/crises';

interface Props {
  crisis: Crisis;
  onAction: () => void;
}

const FLAG_MAP: Record<string, string> = {
  Sudan: '🇸🇩',
  'Democratic Republic of Congo': '🇨🇩',
  Bangladesh: '🇧🇩',
  Yemen: '🇾🇪',
  Pakistan: '🇵🇰',
};

function urgencyColor(score: number) {
  if (score >= 9) return '#ef4444';
  if (score >= 7) return '#f97316';
  return '#22c55e';
}

function BigButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  const filled = active || hov;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1,
        height: '44px',
        borderRadius: '999px',
        border: '1.5px solid #22c55e',
        background: filled ? (active && !hov ? '#22c55e' : '#15803d') : 'transparent',
        color: filled ? '#ffffff' : '#15803d',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {label}
    </button>
  );
}

function OrgPanel({ orgs, label }: { orgs: OrgEntry[]; label: string }) {
  return (
    <div style={{
      background: '#f0faf4',
      borderRadius: '14px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      <p style={{
        fontSize: '11px',
        fontWeight: 700,
        color: '#15803d',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        margin: 0,
      }}>
        {label}
      </p>
      {orgs.map((org) => (
        <a
          key={org.url}
          href={org.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #dcfce7',
            textDecoration: 'none',
          }}
        >
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>
              {org.name}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{org.description}</div>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#15803d', flexShrink: 0, marginLeft: '12px' }}>
            Visit →
          </span>
        </a>
      ))}
    </div>
  );
}

const CarouselCard: React.FC<Props> = ({ crisis, onAction }) => {
  const [barWidth,     setBarWidth]     = useState(0);
  const [activeAction, setActiveAction] = useState<'volunteer' | 'donate' | null>(null);

  // Reset and re-animate on crisis change
  useEffect(() => {
    setBarWidth(0);
    setActiveAction(null);
    const t = setTimeout(() => setBarWidth(crisis.urgencyScore * 10), 300);
    return () => clearTimeout(t);
  }, [crisis.id]);

  const flag      = FLAG_MAP[crisis.country] ?? '🌍';
  const barColor  = urgencyColor(crisis.urgencyScore);
  const rankScore = (crisis.urgencyScore * (1 / crisis.mediaCoverageScore)).toFixed(2);
  const panelOpen = activeAction !== null;

  const handleVolunteer = () => {
    if (activeAction !== 'volunteer') onAction();
    setActiveAction((prev) => prev === 'volunteer' ? null : 'volunteer');
  };

  const handleDonate = () => {
    if (activeAction !== 'donate') onAction();
    setActiveAction((prev) => prev === 'donate' ? null : 'donate');
  };

  const activeOrgs  = activeAction === 'volunteer' ? crisis.volunteerOrgs : crisis.donateOrgs;
  const panelLabel  = activeAction === 'volunteer' ? 'Volunteer opportunities' : 'Donate to this response';

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '20px',
      padding: '32px',
      border: '1px solid #dcfce7',
      boxShadow: '0 4px 20px rgba(34,197,94,0.08)',
    }}>
      {/* ── Header: flag + title + dot + badge ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '32px', lineHeight: 1 }}>{flag}</span>
          <div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '24px',
              fontWeight: 700,
              color: '#0f172a',
              margin: '0 0 4px 0',
              lineHeight: 1.2,
            }}>
              {crisis.title}
            </h2>
            <p style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
              {crisis.country}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <span style={{
            width: '10px', height: '10px',
            borderRadius: '999px',
            background: barColor,
            display: 'inline-block',
            boxShadow: `0 0 0 3px ${barColor}22`,
          }} />
          <span style={{
            background: '#dcfce7', color: '#15803d',
            borderRadius: '999px', padding: '4px 12px',
            fontSize: '12px', fontWeight: 700,
          }}>
            {rankScore}
          </span>
        </div>
      </div>

      {/* ── Description ── */}
      <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.8, margin: '0 0 24px 0' }}>
        {crisis.description}
      </p>

      {/* ── Urgency bar ── */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
            Urgency
          </span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: barColor }}>
            {crisis.urgencyScore}/10
          </span>
        </div>
        <div style={{ background: '#f1f5f9', borderRadius: '999px', height: '8px', width: '100%' }}>
          <div style={{
            width: `${barWidth}%`,
            height: '8px',
            borderRadius: '999px',
            background: barColor,
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Media coverage: {crisis.mediaCoverageScore}/10</span>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{crisis.icdCategory}</span>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ borderTop: '1px solid #f1f5f9', margin: '0 0 20px 0' }} />

      {/* ── Needed on the ground ── */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{
          fontSize: '11px', fontWeight: 700, color: '#15803d',
          textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px',
        }}>
          Needed on the Ground
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {crisis.neededSkills.map((skill) => (
            <span key={skill} style={{
              background: '#f0faf4', color: '#15803d',
              border: '1px solid #dcfce7', borderRadius: '999px',
              padding: '5px 12px', fontSize: '12px', fontWeight: 500,
            }}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: panelOpen ? '16px' : '0' }}>
        <BigButton label="🤝 Volunteer" active={activeAction === 'volunteer'} onClick={handleVolunteer} />
        <BigButton label="❤️ Donate"   active={activeAction === 'donate'}    onClick={handleDonate} />
      </div>

      {/* ── Slide-down panel ── */}
      <div style={{
        maxHeight: panelOpen ? '400px' : '0',
        opacity:   panelOpen ? 1 : 0,
        transition: 'max-height 0.35s ease, opacity 0.25s ease',
      }}>
        {panelOpen && <OrgPanel orgs={activeOrgs} label={panelLabel} />}
      </div>
    </div>
  );
};

export default CarouselCard;
