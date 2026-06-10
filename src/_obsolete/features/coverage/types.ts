export type CoverageRegionLevel = 'department';

export interface CoverageRegionMetric {
  id: string;
  name: string;
  level: CoverageRegionLevel;
  activeIps: number;
  revokedIps: number;
  expiredIps: number;
  tickets: number;
  intensity: number;
}

export interface CoverageOverview {
  regions: CoverageRegionMetric[];
  totalActiveIps: number;
  totalTickets: number;
  activeRegions: number;
}
