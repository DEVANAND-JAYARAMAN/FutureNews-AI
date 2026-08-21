import { useEffect, useState } from 'react';
import { getEditionById } from '../services/futureNewsApi';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function renderList(items) {
  if (!items || items.length === 0) return null;
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{typeof item === 'string' ? item : JSON.stringify(item)}</li>
      ))}
    </ul>
  );
}

export default function EditionModal({ editionId, onClose }) {
  const [edition, setEdition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setEdition(null);

    getEditionById(editionId)
      .then((data) => {
        if (!cancelled) setEdition(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [editionId]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        {loading && (
          <>
            <div className="skeleton skeleton-line" style={{ width: '40%' }} />
            <div className="skeleton skeleton-line" style={{ width: '85%', height: '2rem' }} />
            <div className="skeleton skeleton-line" style={{ width: '95%' }} />
          </>
        )}

        {!loading && error && (
          <div className="state-box">
            <p className="error-message">{error}</p>
          </div>
        )}

        {!loading && !error && edition && (
          <>
            <div className="edition-meta">
              <span>Edition {edition.editionNumber}</span>
              <span>{formatDate(edition.futureDate)}</span>
              {edition.category && <span className="tag">{edition.category}</span>}
            </div>
            <h2 className="headline" style={{ fontSize: '1.8rem' }}>
              {edition.headline}
            </h2>
            {edition.breakingSummary && (
              <p className="breaking-summary">{edition.breakingSummary}</p>
            )}
            <div className="article-body">{edition.article}</div>

            {edition.backgroundContext && (
              <div className="background-context">
                <h4>Background Context</h4>
                <p>{edition.backgroundContext}</p>
              </div>
            )}

            {edition.newFacts?.length > 0 && (
              <div className="modal-section">
                <h4>New Facts</h4>
                {renderList(edition.newFacts)}
              </div>
            )}

            {edition.possibleFutureDevelopments?.length > 0 && (
              <div className="modal-section">
                <h4>Possible Future Developments</h4>
                {renderList(edition.possibleFutureDevelopments)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
