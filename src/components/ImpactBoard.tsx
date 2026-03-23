import React, { useEffect, useRef, useState } from 'react';
import type { Crisis } from '../data/crises';

interface Props {
  crises: Crisis[];
  actionsCount: number;
}

function useCountUp(target: number, duration = 1000): number {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 2);
      setCurrent(Math.round(eased * target));
      if (progress >= 1) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [target, duration]);
  return current;
}

const ImpactBoard: React.FC<Props> = ({ crises, actionsCount }) => {
  const avgUrgencyRaw = crises.reduce((sum, c) => sum + c.urgencyScore, 0) / crises.length;
  const criticalCount = crises.filter((c) => c.urgencyScore >= 8).length;

  const animatedTotal    = useCountUp(crises.length);
  const animatedCritical = useCountUp(criticalCount);
  const animatedAvgRaw   = useCountUp(Math.round(avgUrgencyRaw * 10));
  const animatedAvg      = (animatedAvgRaw / 10).toFixed(1);

  // +1 pop animation on actionsCount increment
  const prevActionsRef    = useRef(actionsCount);
  const [actionScale, setActionScale] = useState(1);

  useEffect(() => {
    if (actionsCount > prevActionsRef.current) {
      setActionScale(1.3);
      const t = setTimeout(() => setActionScale(1), 280);
      prevActionsRef.current = actionsCount;
      return () => clearTimeout(t);
    }
    prevActionsRef.current = actionsCount;
  }, [actionsCount]);

  const mostUnderreported = [...crises].sort((a, b) => a.mediaCoverageScore - b.mediaCoverageScore)[0];

  const statCard = (
    value: string | number,
    label: string,
    valueColor = '#15803d',
    extraStyle: React.CSSProperties = {}
  ) => (
    <div style={{ background: '#f0faf4', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
      <div style={{
        fontSize: '32px',
        fontWeight: 700,
        color: valueColor,
        lineHeight: 1,
        transition: 'transform 0.2s ease',
        ...extraStyle,
      }}>
        {value}
      </div>
      <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '6px' }}>
        {label}
      </div>
    </div>
  );

  return (
    <nav>
      <p style={{
        fontSize: '13px',
        fontWeight: 700,
        color: '#15803d',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: '16px',
        fontFamily: "'Syne', sans-serif",
      }}>
        Overview
      </p>

      {statCard(animatedTotal,    'Active Crises')}
      {statCard(animatedCritical, 'Critical (8+)',    '#ef4444')}
      {statCard(animatedAvg,      'Avg Urgency',      '#f97316')}

      {/* Actions taken — with pop animation */}
      <div style={{ background: '#f0faf4', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
        <div style={{
          fontSize: '32px',
          fontWeight: 700,
          color: '#22c55e',
          lineHeight: 1,
          transform: `scale(${actionScale})`,
          transformOrigin: 'left center',
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          {actionsCount}
        </div>
        <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '6px' }}>
          Actions Taken Today
        </div>
      </div>

      {mostUnderreported && (
        <div style={{ borderLeft: '3px solid #22c55e', paddingLeft: '12px', marginTop: '4px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
            Most Underreported
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
            {mostUnderreported.title}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            {mostUnderreported.country} · media {mostUnderreported.mediaCoverageScore}/10
          </div>
        </div>
      )}
    </nav>
  );
};

export default ImpactBoard;
