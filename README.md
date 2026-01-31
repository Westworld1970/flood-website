# UK Flood Dashboard

A real-time flood monitoring dashboard for the United Kingdom, powered by the Environment Agency Flood Monitoring API.

## Features

- **Real-time Flood Warnings**: Live data from the UK Environment Agency
- **Interactive Map**: Leaflet-based map showing flood monitoring stations and warning areas
- **Severity Indicators**: Color-coded alerts (Severe, Warning, Alert, Clear)
- **Alert Banner**: Prominent display of severe flood warnings with auto-rotation
- **Regional Statistics**: Bar chart visualization of warnings by EA region
- **Auto-refresh**: Data automatically updates every 5 minutes
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- React 19 + TypeScript
- Vite build system
- Leaflet / React-Leaflet for maps
- Recharts for data visualization
- Lucide React for icons
- date-fns for date formatting

## Data Source

Data is fetched from the [Environment Agency Real Time Flood Monitoring API](https://environment.data.gov.uk/flood-monitoring/doc/reference):
- `/id/floods` - Active flood warnings
- `/id/stations` - Monitoring station data with water levels

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Disclaimer

This is a demonstration dashboard. For official flood warnings, visit [check-for-flooding.service.gov.uk](https://check-for-flooding.service.gov.uk/).

## License

MIT
