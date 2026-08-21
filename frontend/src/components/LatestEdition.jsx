import { useState } from 'react';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function LoadingState() {
  return (
    <div className="newspaper">
      <div className="skeleton skeleton-line" style={{ width: '40%' }} />
      <div className="skeleton skeleton-line" style={{ width: '85%', height: '2.4rem' }} />
      <div className="skeleton skeleton-line" style={{ width: '95%' }} />
      <div className="skeleton skeleton-line" style={{ width: '90%' }} />
      <div className="skeleton skeleton-line" style={{ width: '70%' }} />
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="newspaper state-box">
      <p className="error-message">{message}</p>
      <button type="button" className="btn" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

export default function LatestEdition({ edition, loading, error, onRetry }) {
  const [expanded, setExpanded] = useState(false);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!edition) {
    return (
      <div className="newspaper state-box">
        <p>No editions have been generated yet.</p>
      </div>
    );
  }

  return (
    <div className="newspaper fade-up">
      <div className="edition-meta">
        <span>Edition {edition.editionNumber}</span>
        <span>{formatDate(edition.futureDate)}</span>
        {edition.category && <span className="tag">{edition.category}</span>}
      </div>
      <h1 className="headline">{edition.headline}</h1>
      {edition.breakingSummary && (
        <p className="breaking-summary">{edition.breakingSummary}</p>
      )}
      <div className={expanded ? 'article-body' : 'article-body article-preview'}>
        {edition.article}
      </div>
      {edition.backgroundContext && expanded && (
        <div className="background-context">
          <h4>Background Context</h4>
          <p>{edition.backgroundContext}</p>
        </div>
      )}
      <div className="btn-row">
        <button type="button" className="btn btn-primary" onClick={() => setExpanded((v) => !v)}>
          {expanded ? 'Collapse Edition' : 'Read Full Edition'}
        </button>
      </div>
    </div>
  );
}
