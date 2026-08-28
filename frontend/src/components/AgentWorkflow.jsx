const STEPS = [
  { label: 'EventBridge Scheduler', desc: 'Wakes the agent on a recurring schedule' },
  { label: 'FutureNews AI Agent', desc: 'AWS Lambda function starts a new run' },
  { label: 'Load World Memory', desc: 'Reads persistent world state and past editions from DynamoDB' },
  { label: 'Amazon Bedrock', desc: 'Claude Sonnet 4.5 generates the next plausible future event' },
  { label: 'Generate Future Event', desc: 'Drafts headline, article, and consequences' },
  { label: 'Self Review', desc: 'Reviews and revises the draft for consistency' },
  { label: 'Save to DynamoDB', desc: 'Persists the new edition and updated world memory' },
  { label: 'Next Edition', desc: 'The world keeps evolving until the next wake-up' },
];

export default function AgentWorkflow() {
  return (
    <section id="agent" className="section container">
      <div className="section-head">
        <span className="eyebrow">How It Works</span>
        <h2>This Newspaper Writes Itself</h2>
        <p>
          You do not need to open this application for new editions to be generated. An
          autonomous agent runs on a schedule, remembers everything that came before, and
          decides what happens next.
        </p>
      </div>
      <div className="workflow">
        {STEPS.map((step, i) => (
          <div key={step.label} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="workflow-node">
              <span className="index">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <div className="label">{step.label}</div>
                <div className="desc">{step.desc}</div>
              </div>
            </div>
            {i < STEPS.length - 1 && <div className="workflow-connector" />}
          </div>
        ))}
      </div>
      <p className="workflow-tagline">"This newspaper writes itself."</p>
      <p className="workflow-note">
        Every edition is generated using the full history of previous events, so storylines
        evolve logically over time — with no human in the loop.
      </p>
    </section>
  );
}
