import { useEffect, useRef, useState } from 'react';

const MESSAGES = [
  'Loading previous events...',
  'Analyzing world consequences...',
  'Exploring possible futures...',
  'Reviewing narrative consistency...',
  'Writing tomorrow\'s headlines...',
];

function AgentReviewCard({ lastRun }) {
  if (!lastRun) return null;
  const { review, dateValidation, wasRevised, edition } = lastRun;

  return (
    <div className="agent-review fade-up">
      <div className="agent-review-head">
        <span className="eyebrow">Agent Self-Review</span>
        {edition?.editionNumber != null && (
          <span className="agent-review-edition">Edition {edition.editionNumber}</span>
        )}
      </div>
      <div className="agent-review-grid">
        {review && (
          <div className="agent-review-item">
            <span className="agent-review-label">Consistency score</span>
            <span className="agent-review-value">
              {review.score}<span className="agent-review-max">/10</span>
            </span>
          </div>
        )}
        {review && (
          <div className="agent-review-item">
            <span className="agent-review-label">Verdict</span>
            <span className={`agent-review-badge ${review.approved ? 'ok' : 'warn'}`}>
              {review.approved ? 'Approved' : 'Rejected'}
            </span>
          </div>
        )}
        <div className="agent-review-item">
          <span className="agent-review-label">Revision pass</span>
          <span className={`agent-review-badge ${wasRevised ? 'warn' : 'ok'}`}>
            {wasRevised ? 'Revised once' : 'Passed first try'}
          </span>
        </div>
        {dateValidation && (
          <div className="agent-review-item">
            <span className="agent-review-label">Timeline check</span>
            <span className={`agent-review-badge ${dateValidation.valid ? 'ok' : 'warn'}`}>
              {dateValidation.valid ? 'Chronological' : 'Flagged'}
            </span>
          </div>
        )}
      </div>
      {review?.feedback && <p className="agent-review-feedback">“{review.feedback}”</p>}
      {review?.issues?.length > 0 && (
        <ul className="agent-review-issues">
          {review.issues.map((issue, i) => (
            <li key={i}>{typeof issue === 'string' ? issue : JSON.stringify(issue)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function GenerateButton({ generating, onGenerate, error, success, lastRun }) {
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
      {!generating && !error && success && <AgentReviewCard lastRun={lastRun} />}
    </div>
  );
}
