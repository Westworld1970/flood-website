import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RegionChartProps {
  byRegion: Record<string, number>;
}

const COLORS = ['#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#22c55e', '#84cc16', '#eab308', '#f97316'];

export function RegionChart({ byRegion }: RegionChartProps) {
  const data = Object.entries(byRegion)
    .map(([name, count]) => ({ name: name.replace('Environment Agency ', ''), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // Top 8 regions

  if (data.length === 0) {
    return (
      <div className="chart-container">
        <h3>Warnings by Region</h3>
        <div className="no-data">No regional data available</div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3>Warnings by Region</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
          <XAxis type="number" allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
