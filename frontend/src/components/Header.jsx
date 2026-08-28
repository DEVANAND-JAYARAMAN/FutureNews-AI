const NAV_LINKS = [
  { id: 'latest-edition', label: 'Latest Edition' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'archive', label: 'Archive' },
  { id: 'about', label: 'About the Agent' },
];

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <div className="brand">
          FUTURE<span>NEWS</span> AI
        </div>
        <ul className="site-nav">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <button type="button" onClick={() => scrollToSection(link.id)}>
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

function formatFutureDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function Hero({ latest, editionCount = 0, loading = false }) {
  const futureDate = formatFutureDate(latest?.futureDate);

  return (
    <section className="hero container">
      <div className="status-pill">
        <span className="glow-dot" />
        {loading
          ? 'Syncing with the agent…'
          : futureDate
            ? `Autonomous agent active · timeline reached ${futureDate}`
            : 'Autonomous agent active'}
      </div>
      <h1>FUTURENEWS AI</h1>
      <p className="subtitle">"Tomorrow's headlines, written before they happen."</p>
      <p className="description">
        An autonomous AI news agency that wakes up on a schedule, remembers its world, and
        writes the next chapter of the future.
      </p>
      {!loading && editionCount > 0 && (
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-value">{editionCount}</span>
            <span className="hero-stat-label">Editions published</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">{latest?.editionNumber ?? '—'}</span>
            <span className="hero-stat-label">Latest edition</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">0</span>
            <span className="hero-stat-label">Humans in the loop</span>
          </div>
        </div>
      )}
    </section>
  );
}
