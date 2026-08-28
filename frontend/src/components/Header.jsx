import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { id: 'latest-edition', label: 'Latest Edition' },
  { id: 'agent', label: 'How It Works' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'archive', label: 'Archive' },
  { id: 'about', label: 'The Agent' },
];

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Header() {
  const [activeId, setActiveId] = useState(NAV_LINKS[0].id);

  useEffect(() => {
    const sections = NAV_LINKS
      .map((link) => document.getElementById(link.id))
      .filter(Boolean);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="site-header">
      <div className="container">
        <button
          type="button"
          className="brand"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          FUTURE<span>NEWS</span> AI
        </button>
        <ul className="site-nav">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <button
                type="button"
                className={activeId === link.id ? 'active' : ''}
                onClick={() => scrollToSection(link.id)}
              >
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
