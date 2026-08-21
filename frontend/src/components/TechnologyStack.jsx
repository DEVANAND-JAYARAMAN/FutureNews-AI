const TECHNOLOGIES = [
  { name: 'Amazon EventBridge Scheduler', role: 'Wakes the agent on a recurring schedule' },
  { name: 'AWS Lambda', role: 'Runs the autonomous agent logic' },
  { name: 'Amazon Bedrock', role: 'Generates future events and articles' },
  { name: 'Amazon DynamoDB', role: 'Stores persistent world memory and editions' },
  { name: 'Amazon API Gateway', role: 'Exposes the public REST API' },
  { name: 'AWS Amplify', role: 'Hosts and deploys the frontend' },
  { name: 'React + Vite', role: 'Powers this interface' },
];

export default function TechnologyStack() {
  return (
    <section id="about" className="section container">
      <div className="section-head">
        <span className="eyebrow">Under the Hood</span>
        <h2>About the Agent</h2>
        <p>The architecture behind an autonomous newspaper from the future.</p>
      </div>
      <div className="tech-grid">
        {TECHNOLOGIES.map((tech) => (
          <div className="tech-card" key={tech.name}>
            <div className="tech-name">{tech.name}</div>
            <div className="tech-role">{tech.role}</div>
          </div>
        ))}
      </div>
      <p className="about-note">
        "FutureNews AI is not a simple content generator. It maintains persistent memory
        of a fictional world. Every new event is generated using the history of previous
        events, allowing storylines to evolve over time."
      </p>
    </section>
  );
}
