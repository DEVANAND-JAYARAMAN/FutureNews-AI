import { useState } from 'react';
import Header, { Hero } from './components/Header';
import LatestEdition from './components/LatestEdition';
import AgentWorkflow from './components/AgentWorkflow';
import FutureTimeline from './components/FutureTimeline';
import EditionArchive from './components/EditionArchive';
import EditionModal from './components/EditionModal';
import GenerateButton from './components/GenerateButton';
import TechnologyStack from './components/TechnologyStack';
import Footer from './components/Footer';
import { useFutureNews } from './hooks/useFutureNews';

function App() {
  const {
    latest,
    editions,
    latestLoading,
    editionsLoading,
    latestError,
    editionsError,
    generating,
    generateError,
    lastRun,
    reloadLatest,
    reloadEditions,
    generate,
  } = useFutureNews();

  const [selectedEditionId, setSelectedEditionId] = useState(null);
  const [generateSuccess, setGenerateSuccess] = useState(false);

  async function handleGenerate() {
    setGenerateSuccess(false);
    const ok = await generate();
    setGenerateSuccess(ok);
    if (ok) {
      document.getElementById('latest-edition')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <>
      <Header />
      <Hero latest={latest} editionCount={editions.length} loading={latestLoading} />

      <section id="latest-edition" className="section container">
        <div className="section-head">
          <span className="eyebrow">Front Page</span>
          <h2>Latest Edition</h2>
          <p>The most recent dispatch from the world FutureNews AI is writing.</p>
        </div>
        <LatestEdition
          edition={latest}
          loading={latestLoading}
          error={latestError}
          onRetry={reloadLatest}
        />
      </section>

      <AgentWorkflow />

      <FutureTimeline
        editions={editions}
        loading={editionsLoading}
        error={editionsError}
        onRetry={reloadEditions}
        onSelect={setSelectedEditionId}
      />

      <EditionArchive
        editions={editions}
        loading={editionsLoading}
        error={editionsError}
        onRetry={reloadEditions}
        onSelect={setSelectedEditionId}
      />

      <section className="section container">
        <GenerateButton
          generating={generating}
          onGenerate={handleGenerate}
          error={generateError}
          success={generateSuccess}
          lastRun={lastRun}
        />
      </section>

      <TechnologyStack />

      <Footer />

      {selectedEditionId && (
        <EditionModal editionId={selectedEditionId} onClose={() => setSelectedEditionId(null)} />
      )}
    </>
  );
}

export default App;
