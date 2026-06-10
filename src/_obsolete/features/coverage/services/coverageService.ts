import type { CoverageOverview, CoverageRegionMetric } from '../types';
import { mockCoverageSeeds } from '../../../mocks/data/mockCoverage';

const COVERAGE_DELAY_MS = 320;

export async function getCoverageOverview(): Promise<CoverageOverview> {
  await new Promise((resolve) => setTimeout(resolve, COVERAGE_DELAY_MS));

  const maxActiveIps = Math.max(...mockCoverageSeeds.map((region) => region.activeIps), 1);

  const regions: CoverageRegionMetric[] = mockCoverageSeeds
    .map((region) => ({
      ...region,
      level: 'department' as const,
      intensity: Number((region.activeIps / maxActiveIps).toFixed(2)),
    }))
    .sort((left, right) => right.activeIps - left.activeIps);

  return {
    regions,
    totalActiveIps: regions.reduce((total, region) => total + region.activeIps, 0),
    totalTickets: regions.reduce((total, region) => total + region.tickets, 0),
    activeRegions: regions.filter((region) => region.activeIps > 0).length,
  };
}
