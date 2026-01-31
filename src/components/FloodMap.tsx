import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { SEVERITY_CONFIG } from '../types/flood';
import type { FloodWarning, StationReading, SeverityLevel } from '../types/flood';
import { format, parseISO } from 'date-fns';
import 'leaflet/dist/leaflet.css';

interface FloodMapProps {
  warnings: FloodWarning[];
  stations: StationReading[];
  selectedWarning: FloodWarning | null;
  onSelectWarning: (warning: FloodWarning | null) => void;
}

// Component to handle map view changes when warning is selected
function MapController({ selectedWarning, stations }: { selectedWarning: FloodWarning | null; stations: StationReading[] }) {
  const map = useMap();
  const prevWarningRef = useRef<string | null>(null);

  useEffect(() => {
    if (selectedWarning && selectedWarning.id !== prevWarningRef.current) {
      // Try to find a station near the warning area
      const matchingStation = stations.find(
        s => s.riverName?.toLowerCase().includes(selectedWarning.floodArea.riverOrSea?.toLowerCase() || '') ||
             s.town?.toLowerCase().includes(selectedWarning.eaAreaName?.toLowerCase() || '')
      );

      if (matchingStation) {
        map.flyTo([matchingStation.lat, matchingStation.long], 10, { duration: 1 });
      }
      prevWarningRef.current = selectedWarning.id;
    }
  }, [selectedWarning, stations, map]);

  return null;
}

export function FloodMap({ warnings, stations, selectedWarning, onSelectWarning }: FloodMapProps) {
  // UK center coordinates
  const ukCenter: [number, number] = [54.5, -2.5];

  const getStationColor = (status: StationReading['status']) => {
    switch (status) {
      case 'high': return '#dc2626';
      case 'above_normal': return '#ea580c';
      case 'normal': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const getWarningColor = (severityLevel: number) => {
    return SEVERITY_CONFIG[severityLevel as SeverityLevel]?.color || '#6b7280';
  };

  // Create warning markers based on EA area (approximate locations from station data)
  const warningLocations = warnings
    .map(warning => {
      // Try to find a matching station for location
      const matchingStation = stations.find(
        s => s.riverName?.toLowerCase().includes(warning.floodArea.riverOrSea?.toLowerCase() || '') ||
             s.town?.toLowerCase().includes(warning.eaAreaName?.toLowerCase() || '')
      );

      if (matchingStation) {
        return {
          warning,
          lat: matchingStation.lat + (Math.random() - 0.5) * 0.1, // Slight offset to avoid overlap
          lng: matchingStation.long + (Math.random() - 0.5) * 0.1,
        };
      }
      return null;
    })
    .filter(Boolean) as { warning: FloodWarning; lat: number; lng: number }[];

  return (
    <div className="map-container">
      <div className="map-header">
        <h2>Flood Map</h2>
        <div className="map-legend">
          <span className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#dc2626' }}></span>
            Severe/High
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#ea580c' }}></span>
            Warning
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#ca8a04' }}></span>
            Alert
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#16a34a' }}></span>
            Normal
          </span>
        </div>
      </div>

      <MapContainer
        center={ukCenter}
        zoom={6}
        className="leaflet-map"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController selectedWarning={selectedWarning} stations={stations} />

        {/* Station markers */}
        {stations.map((station) => (
          <CircleMarker
            key={station.id}
            center={[station.lat, station.long]}
            radius={6}
            pathOptions={{
              fillColor: getStationColor(station.status),
              fillOpacity: 0.7,
              color: '#fff',
              weight: 1,
            }}
          >
            <Popup>
              <div className="map-popup">
                <h4>{station.label}</h4>
                <p><strong>River:</strong> {station.riverName || 'N/A'}</p>
                <p><strong>Town:</strong> {station.town || 'N/A'}</p>
                {station.latestReading && (
                  <>
                    <p><strong>Level:</strong> {station.latestReading.value.toFixed(2)}m</p>
                    <p><strong>Reading Time:</strong> {format(parseISO(station.latestReading.dateTime), 'dd MMM HH:mm')}</p>
                  </>
                )}
                {station.typicalRangeHigh && (
                  <p><strong>Typical High:</strong> {station.typicalRangeHigh.toFixed(2)}m</p>
                )}
                <p><strong>Status:</strong> <span className={`status-${station.status}`}>{station.status.replace('_', ' ')}</span></p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Warning markers */}
        {warningLocations.map(({ warning, lat, lng }) => (
          <CircleMarker
            key={warning.id}
            center={[lat, lng]}
            radius={warning.severityLevel === 1 ? 12 : warning.severityLevel === 2 ? 10 : 8}
            pathOptions={{
              fillColor: getWarningColor(warning.severityLevel),
              fillOpacity: 0.9,
              color: '#fff',
              weight: 2,
            }}
            eventHandlers={{
              click: () => onSelectWarning(warning),
            }}
          >
            <Popup>
              <div className="map-popup">
                <span
                  className="popup-severity"
                  style={{ backgroundColor: getWarningColor(warning.severityLevel) }}
                >
                  {SEVERITY_CONFIG[warning.severityLevel as SeverityLevel]?.label}
                </span>
                <h4>{warning.description}</h4>
                <p><strong>Area:</strong> {warning.eaAreaName}</p>
                <p><strong>River/Sea:</strong> {warning.floodArea.riverOrSea || 'N/A'}</p>
                <p><strong>Raised:</strong> {format(parseISO(warning.timeRaised), 'dd MMM HH:mm')}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
