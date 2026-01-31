import { useState } from 'react';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { WarningList } from './components/WarningList';
import { FloodMap } from './components/FloodMap';
import { AlertBanner } from './components/AlertBanner';
import { RegionChart } from './components/RegionChart';
import { useFloodWarnings, useStationReadings, useFloodStats } from './hooks/useFloodData';
import type { FloodWarning } from './types/flood';
import './App.css';

function App() {
  const { warnings, loading, error, lastUpdated, refetch } = useFloodWarnings();
  const { stations } = useStationReadings(100);
  const stats = useFloodStats(warnings);
  const [selectedWarning, setSelectedWarning] = useState<FloodWarning | null>(null);

  const handleSelectWarning = (warning: FloodWarning) => {
    setSelectedWarning(warning);
    // Scroll to map on mobile
    if (window.innerWidth < 1024) {
      document.querySelector('.map-container')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app">
      <AlertBanner warnings={warnings} onViewWarning={handleSelectWarning} />
      <Header lastUpdated={lastUpdated} onRefresh={refetch} loading={loading} />

      <main className="main-content">
        {error && (
          <div className="error-banner">
            <p>Error loading flood data: {error}</p>
            <button onClick={refetch}>Try Again</button>
          </div>
        )}

        {loading && warnings.length === 0 ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading flood data from Environment Agency...</p>
          </div>
        ) : (
          <>
            <StatsCards stats={stats} />

            <div className="dashboard-grid">
              <div className="dashboard-left">
                <WarningList
                  warnings={warnings}
                  onSelectWarning={handleSelectWarning}
                  selectedWarningId={selectedWarning?.id || null}
                />
              </div>

              <div className="dashboard-right">
                <FloodMap
                  warnings={warnings}
                  stations={stations}
                  selectedWarning={selectedWarning}
                  onSelectWarning={setSelectedWarning}
                />

                <RegionChart byRegion={stats.byRegion} />
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="footer">
        <p>
          Data provided by the{' '}
          <a
            href="https://environment.data.gov.uk/flood-monitoring/doc/reference"
            target="_blank"
            rel="noopener noreferrer"
          >
            UK Environment Agency Flood Monitoring API
          </a>
        </p>
        <p className="footer-note">
          This is a demonstration dashboard. For official flood warnings, visit{' '}
          <a href="https://check-for-flooding.service.gov.uk/" target="_blank" rel="noopener noreferrer">
            check-for-flooding.service.gov.uk
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
