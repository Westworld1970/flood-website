import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ChevronDown, ChevronUp, MapPin, Clock, Waves } from 'lucide-react';
import { SEVERITY_CONFIG } from '../types/flood';
import type { FloodWarning, SeverityLevel } from '../types/flood';

interface WarningListProps {
  warnings: FloodWarning[];
  onSelectWarning: (warning: FloodWarning) => void;
  selectedWarningId: string | null;
}

export function WarningList({ warnings, onSelectWarning, selectedWarningId }: WarningListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<number | 'all'>('all');

  const filteredWarnings = filter === 'all'
    ? warnings
    : warnings.filter(w => w.severityLevel === filter);

  const getSeverityConfig = (level: number) => {
    return SEVERITY_CONFIG[level as SeverityLevel] || SEVERITY_CONFIG[4];
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="warning-list-container">
      <div className="warning-list-header">
        <h2>Active Warnings ({filteredWarnings.length})</h2>
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
        >
          <option value="all">All Levels</option>
          <option value="1">Severe Only</option>
          <option value="2">Warnings Only</option>
          <option value="3">Alerts Only</option>
        </select>
      </div>

      <div className="warning-list">
        {filteredWarnings.length === 0 ? (
          <div className="no-warnings">
            <Waves size={48} />
            <p>No active warnings matching filter</p>
          </div>
        ) : (
          filteredWarnings.map((warning) => {
            const config = getSeverityConfig(warning.severityLevel);
            const isExpanded = expandedId === warning.id;
            const isSelected = selectedWarningId === warning.id;

            return (
              <div
                key={warning.id}
                className={`warning-item ${isSelected ? 'selected' : ''}`}
                style={{ borderLeftColor: config.color }}
              >
                <div
                  className="warning-item-header"
                  onClick={() => {
                    onSelectWarning(warning);
                    toggleExpand(warning.id);
                  }}
                >
                  <div className="warning-item-main">
                    <span
                      className="severity-badge"
                      style={{ backgroundColor: config.color }}
                    >
                      {config.label}
                    </span>
                    <h3 className="warning-title">{warning.description}</h3>
                    <div className="warning-meta">
                      <span className="warning-location">
                        <MapPin size={14} />
                        {warning.eaAreaName || warning.floodArea.county}
                      </span>
                      {warning.floodArea.riverOrSea && (
                        <span className="warning-river">
                          <Waves size={14} />
                          {warning.floodArea.riverOrSea}
                        </span>
                      )}
                      <span className="warning-time">
                        <Clock size={14} />
                        {format(parseISO(warning.timeRaised), 'dd MMM HH:mm')}
                      </span>
                    </div>
                  </div>
                  <button className="expand-btn">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="warning-details">
                    <div className="warning-message">
                      <h4>Message</h4>
                      <p>{warning.message || 'No additional message available.'}</p>
                    </div>
                    <div className="warning-info-grid">
                      <div>
                        <strong>Region:</strong> {warning.eaRegionName || 'N/A'}
                      </div>
                      <div>
                        <strong>Tidal:</strong> {warning.isTidal ? 'Yes' : 'No'}
                      </div>
                      <div>
                        <strong>Severity Changed:</strong>{' '}
                        {warning.timeSeverityChanged
                          ? format(parseISO(warning.timeSeverityChanged), 'dd MMM yyyy HH:mm')
                          : 'N/A'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
