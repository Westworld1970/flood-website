import { AlertTriangle, AlertCircle, Bell, CheckCircle } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    severe: number;
    warning: number;
    alert: number;
    noLongerInForce: number;
    total: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Severe Warnings',
      value: stats.severe,
      icon: AlertTriangle,
      color: 'severe',
      description: 'Danger to life',
    },
    {
      label: 'Flood Warnings',
      value: stats.warning,
      icon: AlertCircle,
      color: 'warning',
      description: 'Immediate action required',
    },
    {
      label: 'Flood Alerts',
      value: stats.alert,
      icon: Bell,
      color: 'alert',
      description: 'Be prepared',
    },
    {
      label: 'No Longer Active',
      value: stats.noLongerInForce,
      icon: CheckCircle,
      color: 'clear',
      description: 'Recently cleared',
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div key={card.label} className={`stat-card stat-card-${card.color}`}>
          <div className="stat-card-header">
            <card.icon className="stat-icon" />
            <span className="stat-label">{card.label}</span>
          </div>
          <div className="stat-value">{card.value}</div>
          <div className="stat-description">{card.description}</div>
        </div>
      ))}
    </div>
  );
}
