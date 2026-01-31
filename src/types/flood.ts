// Types for UK Environment Agency Flood API

export interface FloodWarning {
  id: string;
  description: string;
  eaAreaName: string;
  eaRegionName: string;
  floodArea: {
    county: string;
    notation: string;
    polygon?: string;
    riverOrSea: string;
  };
  floodAreaID: string;
  isTidal: boolean;
  message: string;
  messageChanged: string;
  severity: string;
  severityLevel: number;
  timeMessageChanged: string;
  timeRaised: string;
  timeSeverityChanged: string;
}

export interface FloodArea {
  id: string;
  label: string;
  county: string;
  riverOrSea: string;
  lat?: number;
  long?: number;
  currentWarning?: FloodWarning;
}

export interface StationReading {
  id: string;
  stationReference: string;
  label: string;
  riverName: string;
  town: string;
  lat: number;
  long: number;
  latestReading?: {
    dateTime: string;
    value: number;
  };
  typicalRangeHigh?: number;
  typicalRangeLow?: number;
  status: 'normal' | 'above_normal' | 'high' | 'unknown';
}

export interface FloodApiResponse {
  items: FloodWarning[];
}

export interface StationApiResponse {
  items: StationReading[];
}

export type SeverityLevel = 1 | 2 | 3 | 4;

export const SEVERITY_CONFIG: Record<SeverityLevel, { label: string; color: string; bgColor: string; description: string }> = {
  1: {
    label: 'Severe Flood Warning',
    color: '#dc2626',
    bgColor: '#fef2f2',
    description: 'Severe flooding. Danger to life.'
  },
  2: {
    label: 'Flood Warning',
    color: '#ea580c',
    bgColor: '#fff7ed',
    description: 'Flooding is expected. Immediate action required.'
  },
  3: {
    label: 'Flood Alert',
    color: '#ca8a04',
    bgColor: '#fefce8',
    description: 'Flooding is possible. Be prepared.'
  },
  4: {
    label: 'Warning No Longer in Force',
    color: '#16a34a',
    bgColor: '#f0fdf4',
    description: 'No longer in force.'
  }
};
