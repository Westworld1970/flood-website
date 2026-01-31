import { useState, useEffect } from 'react';
import { AlertTriangle, X, ChevronRight } from 'lucide-react';
import { SEVERITY_CONFIG } from '../types/flood';
import type { FloodWarning } from '../types/flood';

interface AlertBannerProps {
  warnings: FloodWarning[];
  onViewWarning: (warning: FloodWarning) => void;
}

export function AlertBanner({ warnings, onViewWarning }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get only severe warnings (level 1)
  const severeWarnings = warnings.filter(w => w.severityLevel === 1);

  // Auto-rotate through severe warnings
  useEffect(() => {
    if (severeWarnings.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % severeWarnings.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [severeWarnings.length]);

  if (dismissed || severeWarnings.length === 0) {
    return null;
  }

  const currentWarning = severeWarnings[currentIndex];
  const config = SEVERITY_CONFIG[1];

  return (
    <div className="alert-banner" style={{ backgroundColor: config.color }}>
      <div className="alert-banner-content">
        <div className="alert-banner-icon">
          <AlertTriangle size={24} />
        </div>
        <div className="alert-banner-text">
          <strong>SEVERE FLOOD WARNING</strong>
          <span className="alert-banner-message">
            {currentWarning.description}
            {severeWarnings.length > 1 && (
              <span className="alert-counter">
                ({currentIndex + 1} of {severeWarnings.length})
              </span>
            )}
          </span>
        </div>
        <button
          className="alert-banner-action"
          onClick={() => onViewWarning(currentWarning)}
        >
          View Details
          <ChevronRight size={16} />
        </button>
        <button
          className="alert-banner-dismiss"
          onClick={() => setDismissed(true)}
          title="Dismiss"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
