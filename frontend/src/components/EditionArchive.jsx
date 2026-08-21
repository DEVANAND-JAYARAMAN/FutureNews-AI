function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function LoadingState() {
  return (
    <div className="archive-grid">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div className="archive-card" key={i}>
          <div className="skeleton skeleton-line" style={{ width: '40%' }} />
          <div className="skeleton skeleton-line" style={{ width: '80%', height: '1.4rem' }} />
          <div className="skeleton skeleton-line" style={{ width: '90%' }} />
        </div>
      ))}
    </div>
  );
}

export default function EditionArchive({ editions, loading, error, onRetry, onSelect }) {
  return (
    <section id="archive" className="section container">
      <div className="section-head">
        <span className="eyebrow">Full Record</span>
        <h2>Edition Archive</h2>
        <p>Browse every edition FutureNews AI has published from the future.</p>
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
          <p>The archive is empty. Generate the first edition to start the record.</p>
        </div>
      )}

      {!loading && !error && editions.length > 0 && (
        <div className="archive-grid">
          {editions.map((edition) => (
            <div
              className="archive-card"
              key={edition.editionId}
              onClick={() => onSelect(edition.editionId)}
            >
              <div className="meta-row">
                <span>Edition {edition.editionNumber}</span>
                <span>{formatDate(edition.futureDate)}</span>
                {edition.category && <span>{edition.category}</span>}
              </div>
              <h3>{edition.headline}</h3>
              <p>{edition.breakingSummary}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
