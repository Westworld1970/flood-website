import { Droplets, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface HeaderProps {
  lastUpdated: Date | null;
  onRefresh: () => void;
  loading: boolean;
}

export function Header({ lastUpdated, onRefresh, loading }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <Droplets className="header-icon" />
          <div>
            <h1>UK Flood Dashboard</h1>
            <p className="header-subtitle">
              Real-time flood warnings from Environment Agency
            </p>
          </div>
        </div>
        <div className="header-right">
          {lastUpdated && (
            <span className="last-updated">
              Last updated: {format(lastUpdated, 'HH:mm:ss')}
            </span>
          )}
          <button
            className="refresh-btn"
            onClick={onRefresh}
            disabled={loading}
            title="Refresh data"
          >
            <RefreshCw className={loading ? 'spinning' : ''} size={18} />
            Refresh
          </button>
        </div>
      </div>
    </header>
  );
}
