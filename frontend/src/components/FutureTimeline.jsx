function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function LoadingState() {
  return (
    <div className="timeline">
      {[0, 1, 2].map((i) => (
        <div className="timeline-item" key={i}>
          <div className="timeline-card">
            <div className="skeleton skeleton-line" style={{ width: '30%' }} />
            <div className="skeleton skeleton-line" style={{ width: '60%', height: '1.4rem' }} />
            <div className="skeleton skeleton-line" style={{ width: '80%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FutureTimeline({ editions, loading, error, onRetry, onSelect }) {
  return (
    <section id="timeline" className="section container">
      <div className="section-head">
        <span className="eyebrow">The Evolving World</span>
        <h2>Future Timeline</h2>
        <p>Each edition builds on the last — one event leads logically to the next.</p>
      </div>

      {loading && <LoadingState />}

      {!loading && error && (
        <div className="state-box">
          <p className="error-message">{error}</p>
          <button type="button" className="btn" onClick={onRetry}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && editions.length === 0 && (
        <div className="state-box">
          <p>No editions yet. Generate the first future event to begin the timeline.</p>
        </div>
      )}

      {!loading && !error && editions.length > 0 && (
        <div className="timeline">
          {editions.map((edition) => (
            <div
              className="timeline-item"
              key={edition.editionId}
              onClick={() => onSelect(edition.editionId)}
            >
              <div className="timeline-card">
                <div className="meta-row">
                  <span>Edition {edition.editionNumber}</span>
                  <span>{formatDate(edition.futureDate)}</span>
                  {edition.category && <span>{edition.category}</span>}
                </div>
                <h3>{edition.headline}</h3>
                <p>{edition.breakingSummary}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
