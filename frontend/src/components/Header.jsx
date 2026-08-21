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

export function Hero() {
  return (
    <section className="hero container">
      <div className="status-pill">
        <span className="glow-dot" /> Autonomous Agent Active
      </div>
      <h1>FUTURENEWS AI</h1>
      <p className="subtitle">"Tomorrow's headlines, written before they happen."</p>
      <p className="description">
        An autonomous AI news agency that wakes up, remembers its world, and writes the
        next chapter of the future.
      </p>
    </section>
  );
}
