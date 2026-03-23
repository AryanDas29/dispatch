import React, { useState, useEffect } from 'react';
import type { Crisis } from '../data/crises';
import { useInView } from '../hooks/useInView';

interface Props {
  crisis: Crisis;
  index: number;
  onAction: () => void;
}

interface OrgLink {
  name: string;
  url: string;
  desc: string;
}

const FLAG_MAP: Record<string, string> = {
  Sudan: '🇸🇩',
  'Democratic Republic of Congo': '🇨🇩',
  Bangladesh: '🇧🇩',
  Yemen: '🇾🇪',
  Pakistan: '🇵🇰',
};

function urgencyColor(score: number): string {
  if (score >= 9) return '#ef4444';
  if (score >= 7) return '#f97316';
  return '#22c55e';
}

function getOrgLinks(skills: string[]): OrgLink[] {
  const links: OrgLink[] = [];
  const s = skills.map((x) => x.toLowerCase());

  if (s.some((x) => ['emergency medicine', 'pediatrics', 'infectious disease', 'medical'].includes(x)))
    links.push({ name: 'Médecins Sans Frontières', url: 'https://www.msf.org', desc: 'Emergency medical volunteers needed on the ground' });

  if (s.some((x) => ['nutrition', 'supply chain', 'logistics'].includes(x)))
    links.push({ name: 'World Food Programme', url: 'https://www.wfp.org', desc: 'Food aid logistics and supply chain support' });

  if (s.some((x) => ['wash', 'public health', 'community health', 'epidemiology', 'vaccination', 'contact tracing'].includes(x)))
    links.push({ name: 'UNICEF', url: 'https://www.unicef.org', desc: 'WASH, vaccination and community health programs' });

  if (links.length === 0) {
    links.push({ name: 'UNICEF',                  url: 'https://www.unicef.org', desc: 'Humanitarian response and child protection' });
    links.push({ name: 'Médecins Sans Frontières', url: 'https://www.msf.org',   desc: 'Emergency medical response worldwide' });
  }

  return links.slice(0, 3);
}

function ActionButton({
  label,
  filled,
  onClick,
}: {
  label: string;
  filled: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '8px 16px',
        borderRadius: '8px',
        border: '1.5px solid #22c55e',
        background: filled
          ? hovered ? '#15803d' : '#22c55e'
          : hovered ? '#22c55e' : 'transparent',
        color: filled ? '#ffffff' : hovered ? '#ffffff' : '#15803d',
        fontSize: '13px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {label}
    </button>
  );
}

const ActionCard: React.FC<Props> = ({ crisis, index, onAction }) => {
  const [ref, inView]     = useInView<HTMLElement>({ threshold: 0.1 });
  const [hovered,  setHovered]  = useState(false);
  const [barWidth, setBarWidth] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setBarWidth(crisis.urgencyScore * 10), 300);
    return () => clearTimeout(t);
  }, [inView, crisis.urgencyScore]);

  const rankScore  = (crisis.urgencyScore * (1 / crisis.mediaCoverageScore)).toFixed(2);
  const flag       = FLAG_MAP[crisis.country] ?? '🌍';
  const barColor   = urgencyColor(crisis.urgencyScore);
  const enterDelay = `${index * 0.12}s`;
  const orgLinks   = getOrgLinks(crisis.neededSkills);

  const handleActionClick = (type: 'volunteer' | 'donate') => {
    onAction();
    setPanelOpen((prev) => !prev);
  };

  return (
    <article
      ref={ref}
      className="action-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '16px',
        border: '1px solid #dcfce7',
        boxShadow: hovered
          ? '0 8px 24px rgba(34,197,94,0.15)'
          : '0 2px 8px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease, opacity 0.5s ease, translate 0.5s ease',
        opacity: inView ? 1 : 0,
        translate: inView ? '0 0' : '0 30px',
        transitionDelay: inView ? enterDelay : '0s',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px', lineHeight: 1 }}>{flag}</span>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 2px 0' }}>
              {crisis.title}
            </h2>
            <p style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
              {crisis.country}
            </p>
          </div>
        </div>
        <span style={{ background: '#dcfce7', color: '#15803d', borderRadius: '999px', padding: '4px 10px', fontSize: '12px', fontWeight: 600, flexShrink: 0 }}>
          {rankScore}
        </span>
      </div>

      {/* Description */}
      <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7, margin: '0 0 16px 0' }}>
        {crisis.description}
      </p>

      {/* Urgency bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0 }}>
          Urgency
        </span>
        <span style={{ fontSize: '12px', fontWeight: 600, color: barColor, flexShrink: 0 }}>
          {crisis.urgencyScore}/10
        </span>
        <div style={{ flex: 1, background: '#f1f5f9', borderRadius: '999px', height: '6px' }}>
          <div style={{
            width: `${barWidth}%`,
            height: '6px',
            borderRadius: '999px',
            background: barColor,
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }} />
        </div>
        <span style={{ fontSize: '11px', color: '#64748b', flexShrink: 0 }}>
          Media {crisis.mediaCoverageScore}/10
        </span>
      </div>

      {/* Skill pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
        {crisis.neededSkills.map((skill) => (
          <span key={skill} style={{
            background: '#f0faf4',
            color: '#15803d',
            border: '1px solid #dcfce7',
            borderRadius: '999px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 500,
          }}>
            {skill}
          </span>
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: panelOpen ? '16px' : '0' }}>
        <ActionButton label="🤝 Volunteer" filled={false} onClick={() => handleActionClick('volunteer')} />
        <ActionButton label="❤️ Donate"   filled={true}  onClick={() => handleActionClick('donate')} />
      </div>

      {/* Sliding panel */}
      <div style={{
        maxHeight: panelOpen ? '300px' : '0',
        opacity: panelOpen ? 1 : 0,
        transition: 'max-height 0.35s ease, opacity 0.25s ease',
      }}>
        <div style={{
          background: '#f0faf4',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            Take action now
          </p>
          {orgLinks.map((org) => (
            <a
              key={org.url}
              href={org.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                textDecoration: 'none',
                padding: '10px 12px',
                background: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #dcfce7',
                transition: 'border-color 0.15s ease',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#15803d' }}>{org.name} →</span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>{org.desc}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ICD tag */}
      <p style={{ fontSize: '11px', color: '#94a3b8', margin: panelOpen ? '12px 0 0' : '12px 0 0' }}>
        {crisis.icdCategory}
      </p>
    </article>
  );
};

export default ActionCard;
