import React, { useState, useCallback } from 'react';
import type { Crisis } from '../data/crises';
import CarouselCard from './CarouselCard';

interface Props {
  crises: Crisis[];
  onAction: () => void;
}

const ANIM_DURATION = 400;

const CrisisFeed: React.FC<Props> = ({ crises, onAction }) => {
  const [currentIndex,  setCurrentIndex]  = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const [direction,     setDirection]     = useState<'left' | 'right'>('right');
  const [isAnimating,   setIsAnimating]   = useState(false);

  const navigate = useCallback((newIndex: number, dir: 'left' | 'right') => {
    if (isAnimating || newIndex === currentIndex) return;
    setOutgoingIndex(currentIndex);
    setCurrentIndex(newIndex);
    setDirection(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setOutgoingIndex(null);
      setIsAnimating(false);
    }, ANIM_DURATION);
  }, [isAnimating, currentIndex]);

  const goNext = () => navigate((currentIndex + 1) % crises.length, 'right');
  const goPrev = () => navigate((currentIndex - 1 + crises.length) % crises.length, 'left');

  const enterClass = direction === 'right' ? 'entering-right' : 'entering-left';
  const exitClass  = direction === 'right' ? 'exiting-left'   : 'exiting-right';

  return (
    <div>
      {/* ── "Crisis X of Y" pill ── */}
      <div style={{ margin: '24px 0 20px' }}>
        <span style={{
          display: 'inline-block',
          background: '#dcfce7',
          color: '#15803d',
          borderRadius: '999px',
          padding: '4px 14px',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          Crisis {currentIndex + 1} of {crises.length}
        </span>
      </div>

      {/* ── Carousel ── */}
      <div style={{ position: 'relative', padding: '0 52px' }}>
        <ArrowBtn side="left"  onClick={goPrev} disabled={isAnimating} />
        <ArrowBtn side="right" onClick={goNext} disabled={isAnimating} />

        {/* Viewport — overflow hidden clips sliding cards */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          maxWidth: '680px',
          margin: '0 auto',
          borderRadius: '20px',
        }}>
          {/* Exiting card (absolutely positioned, doesn't affect layout height) */}
          {outgoingIndex !== null && (
            <div
              className={exitClass}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            >
              <CarouselCard crisis={crises[outgoingIndex]} onAction={onAction} />
            </div>
          )}

          {/* Entering card (in flow — sets the container height) */}
          <div className={isAnimating ? enterClass : ''}>
            <CarouselCard crisis={crises[currentIndex]} onAction={onAction} />
          </div>
        </div>

        {/* ── Dot indicators ── */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
          {crises.map((_, i) => (
            <button
              key={i}
              onClick={() => navigate(i, i > currentIndex ? 'right' : 'left')}
              aria-label={`Go to crisis ${i + 1}`}
              style={{
                width:        i === currentIndex ? '24px' : '12px',
                height:       '12px',
                borderRadius: '999px',
                background:   i === currentIndex ? '#22c55e' : '#dcfce7',
                border:       'none',
                cursor:       'pointer',
                padding:      0,
                transition:   'width 0.3s ease, background 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Arrow button ──────────────────────────────────────────── */

function ArrowBtn({
  side,
  onClick,
  disabled,
}: {
  side: 'left' | 'right';
  onClick: () => void;
  disabled: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label={side === 'left' ? 'Previous crisis' : 'Next crisis'}
      style={{
        position:    'absolute',
        [side]:      '0',
        top:         '50%',
        transform:   'translateY(-50%)',
        width:       '48px',
        height:      '48px',
        borderRadius: '999px',
        background:  hov ? '#f0faf4' : '#ffffff',
        border:      '1.5px solid #dcfce7',
        boxShadow:   '0 2px 8px rgba(0,0,0,0.08)',
        cursor:      disabled ? 'not-allowed' : 'pointer',
        fontSize:    '18px',
        display:     'flex',
        alignItems:  'center',
        justifyContent: 'center',
        zIndex:      10,
        opacity:     disabled ? 0.5 : 1,
        transition:  'background 0.15s ease, opacity 0.15s ease',
        padding:     0,
        lineHeight:  1,
      }}
    >
      {side === 'left' ? '←' : '→'}
    </button>
  );
}

export default CrisisFeed;
