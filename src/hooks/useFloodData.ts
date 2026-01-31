import { useState, useEffect, useCallback } from 'react';
import type { FloodWarning, StationReading } from '../types/flood';

const EA_FLOOD_API = 'https://environment.data.gov.uk/flood-monitoring';

export function useFloodWarnings() {
  const [warnings, setWarnings] = useState<FloodWarning[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchWarnings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${EA_FLOOD_API}/id/floods`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const processedWarnings: FloodWarning[] = data.items.map((item: any) => ({
        id: item['@id'] || item.floodAreaID,
        description: item.description || '',
        eaAreaName: item.eaAreaName || '',
        eaRegionName: item.eaRegionName || '',
        floodArea: {
          county: item.floodArea?.county || '',
          notation: item.floodArea?.notation || '',
          polygon: item.floodArea?.polygon,
          riverOrSea: item.floodArea?.riverOrSea || '',
        },
        floodAreaID: item.floodAreaID || '',
        isTidal: item.isTidal || false,
        message: item.message || '',
        messageChanged: item.messageChanged || '',
        severity: item.severity || '',
        severityLevel: item.severityLevel || 4,
        timeMessageChanged: item.timeMessageChanged || '',
        timeRaised: item.timeRaised || '',
        timeSeverityChanged: item.timeSeverityChanged || '',
      }));

      // Sort by severity (most severe first)
      processedWarnings.sort((a, b) => a.severityLevel - b.severityLevel);

      setWarnings(processedWarnings);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch flood warnings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWarnings();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchWarnings, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWarnings]);

  return { warnings, loading, error, lastUpdated, refetch: fetchWarnings };
}

export function useStationReadings(limit = 50) {
  const [stations, setStations] = useState<StationReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch stations with latest readings
      const response = await fetch(
        `${EA_FLOOD_API}/id/stations?_limit=${limit}&parameter=level&status=Active`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const processedStations: StationReading[] = data.items
        .filter((item: any) => item.lat && item.long)
        .map((item: any) => {
          const latestValue = item.measures?.[0]?.latestReading?.value;
          const typicalHigh = item.stageScale?.typicalRangeHigh;
          const typicalLow = item.stageScale?.typicalRangeLow;

          let status: 'normal' | 'above_normal' | 'high' | 'unknown' = 'unknown';
          if (latestValue !== undefined && typicalHigh !== undefined) {
            if (latestValue > typicalHigh * 1.2) {
              status = 'high';
            } else if (latestValue > typicalHigh) {
              status = 'above_normal';
            } else {
              status = 'normal';
            }
          }

          return {
            id: item['@id'] || item.stationReference,
            stationReference: item.stationReference || '',
            label: item.label || '',
            riverName: item.riverName || '',
            town: item.town || '',
            lat: item.lat,
            long: item.long,
            latestReading: item.measures?.[0]?.latestReading ? {
              dateTime: item.measures[0].latestReading.dateTime,
              value: item.measures[0].latestReading.value,
            } : undefined,
            typicalRangeHigh: typicalHigh,
            typicalRangeLow: typicalLow,
            status,
          };
        });

      setStations(processedStations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch station readings');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  return { stations, loading, error, refetch: fetchStations };
}

export function useFloodStats(warnings: FloodWarning[]) {
  const stats = {
    severe: warnings.filter(w => w.severityLevel === 1).length,
    warning: warnings.filter(w => w.severityLevel === 2).length,
    alert: warnings.filter(w => w.severityLevel === 3).length,
    noLongerInForce: warnings.filter(w => w.severityLevel === 4).length,
    total: warnings.length,
    byRegion: {} as Record<string, number>,
  };

  warnings.forEach(w => {
    const region = w.eaRegionName || 'Unknown';
    stats.byRegion[region] = (stats.byRegion[region] || 0) + 1;
  });

  return stats;
}
