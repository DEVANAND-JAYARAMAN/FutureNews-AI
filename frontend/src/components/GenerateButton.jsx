import { useEffect, useRef, useState } from 'react';

const MESSAGES = [
  'Loading previous events...',
  'Analyzing world consequences...',
  'Exploring possible futures...',
  'Reviewing narrative consistency...',
  'Writing tomorrow\'s headlines...',
];

export default function GenerateButton({ generating, onGenerate, error, success }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (generating) {
      setMessageIndex(0);
      intervalRef.current = setInterval(() => {
        setMessageIndex((i) => (i + 1) % MESSAGES.length);
      }, 1800);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [generating]);

  return (
    <div className="glass generate-panel">
      <span className="eyebrow">Trigger the Agent</span>
      <h2 style={{ fontFamily: 'var(--font-display)', margin: '0.6rem 0 0.9rem', fontSize: '1.8rem' }}>
        Generate Next Future
      </h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto 1.6rem' }}>
        Trigger the FutureNews AI agent to analyze world memory and write the next edition.
      </p>
      <button type="button" className="btn btn-primary" onClick={onGenerate} disabled={generating}>
        {generating ? 'Generating...' : 'Generate Next Future'}
      </button>
      <div className="generate-status">
        {generating && MESSAGES[messageIndex]}
        {!generating && error && <span className="error-message">{error}</span>}
        {!generating && !error && success && 'New edition published.'}
      </div>
    </div>
  );
}
