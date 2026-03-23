import React from 'react';
import type { DailyBriefOutput } from '../lib/aiEngine';
import type { UserProfile } from '../types/profile';
import type { Crisis } from '../data/crises';

interface Props {
  brief: DailyBriefOutput | null;
  loading: boolean;
  error: string | null;
  profile: UserProfile | null;
  topCrisis: Crisis | null;
}

const SkeletonRect = ({ width = '100%', height = '18px', delay = '0s' }: {
  width?: string;
  height?: string;
  delay?: string;
}) => (
  <div style={{
    width, height,
    background: '#e2e8f0',
    borderRadius: '6px',
    animation: `pulse 1.4s ease-in-out ${delay} infinite`,
  }} />
);

interface PersonalizedAction {
  text: string;
  url: string;
}

function getPersonalizedAction(profile: UserProfile, crisis: Crisis): PersonalizedAction {
  const skillMap: Record<string, PersonalizedAction> = {
    '🏥 Medical': {
      text: `Connect with MSF's emergency volunteer program for the ${crisis.title} in ${crisis.country}.`,
      url: 'https://www.msf.org/volunteer',
    },
    '💻 Tech': {
      text: `Use your technical skills to support crisis data mapping for ${crisis.country} with OCHA.`,
      url: 'https://www.unocha.org',
    },
    '🌍 Languages': {
      text: `Volunteer as a remote interpreter for aid coordination in ${crisis.country}.`,
      url: 'https://translatorswithoutborders.org',
    },
    '📦 Logistics': {
      text: `Support supply chain coordination for the ${crisis.title} response with WFP.`,
      url: 'https://www.wfp.org/support-us',
    },
    '📢 Advocacy': {
      text: `Amplify the ${crisis.title} in ${crisis.country} — share this briefing and contact your representative.`,
      url: 'https://www.amnesty.org/en/get-involved/',
    },
  };

  const matchedSkill = profile.skills.find((s) => skillMap[s]);
  return matchedSkill
    ? skillMap[matchedSkill]
    : { text: `Support humanitarian response to the ${crisis.title} in ${crisis.country}.`, url: 'https://www.unicef.org' };
}

const DailyBrief: React.FC<Props> = ({ brief, loading, error, profile, topCrisis }) => {
  const personalizedAction =
    profile && profile.skills.length > 0 && topCrisis
      ? getPersonalizedAction(profile, topCrisis)
      : null;

  return (
    <section style={{
      background: '#ffffff',
      borderRadius: '20px',
      padding: '32px',
      boxShadow: '0 4px 20px rgba(34,197,94,0.1)',
      border: '1px solid #dcfce7',
      animation: 'fadeSlideIn 0.5s ease forwards',
    }}>
      {/* Eyebrow + live pulse dot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{
          display: 'inline-block',
          background: '#dcfce7',
          color: '#15803d',
          borderRadius: '999px',
          padding: '4px 12px',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          Intel Brief
        </span>
        <span style={{ position: 'relative', display: 'inline-flex', width: '8px', height: '8px' }}>
          <span style={{ position: 'absolute', inset: 0, borderRadius: '999px', background: '#22c55e', animation: 'ping 2s ease-out infinite' }} />
          <span style={{ position: 'relative', width: '8px', height: '8px', borderRadius: '999px', background: '#22c55e' }} />
        </span>
      </div>

      {/* Skeleton */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <SkeletonRect width="75%" height="32px" delay="0s" />
          <SkeletonRect width="100%" height="18px" delay="0.1s" />
          <SkeletonRect width="90%"  height="18px" delay="0.2s" />
          <SkeletonRect width="60%"  height="18px" delay="0.3s" />
        </div>
      )}

      {error && <p style={{ fontSize: '15px', color: '#ef4444', margin: 0 }}>{error}</p>}

      {brief && !loading && (
        <>
          <h1 style={{
            fontSize: '26px',
            fontWeight: 700,
            color: '#0f172a',
            lineHeight: '1.5',
            marginBottom: '16px',
            overflow: 'visible',
            paddingBottom: '8px',
            fontFamily: 'Syne, sans-serif',
            WebkitFontSmoothing: 'antialiased',
          }}>
            {brief.headline}
          </h1>
          {brief.summary && (
            <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.8, margin: 0 }}>
              {brief.summary}
            </p>
          )}
        </>
      )}

      {/* Personalized action box */}
      {personalizedAction && !loading && (
        <div style={{
          background: '#f0faf4',
          borderRadius: '12px',
          borderLeft: '3px solid #22c55e',
          padding: '16px',
          marginTop: '24px',
        }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#15803d', margin: '0 0 6px 0' }}>
            Your action for today
          </p>
          <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6, margin: '0 0 10px 0' }}>
            {personalizedAction.text}
          </p>
          <a
            href={personalizedAction.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '13px', fontWeight: 600, color: '#15803d', textDecoration: 'none' }}
          >
            → Take this action
          </a>
        </div>
      )}
    </section>
  );
};

export default DailyBrief;
