import { useEffect, useMemo, useRef, useState } from 'react';
import type { CoverageRegionMetric } from '../types';

interface PeruCoverageMapProps {
  regions: CoverageRegionMetric[];
  selectedRegionId: string;
  onSelectRegion: (regionId: string) => void;
}

interface PeruSvgPath {
  id: string;
  title: string;
  d: string;
}

interface RegionCenter {
  x: number;
  y: number;
}

const defaultViewBox = '0 0 542.76703 792';

function getRegionFill(intensity: number, isSelected: boolean): string {
  if (isSelected) return '#F3188F';
  if (intensity >= 0.78) return '#D91A7D';
  if (intensity >= 0.58) return '#C743AF';
  if (intensity >= 0.34) return '#8258F6';
  return '#4A355F';
}

function getBubbleRadius(activeIps: number): number {
  return Math.max(9, Math.min(22, Math.round(8 + activeIps / 8)));
}

export function PeruCoverageMap({ regions, selectedRegionId, onSelectRegion }: PeruCoverageMapProps) {
  const [paths, setPaths] = useState<PeruSvgPath[]>([]);
  const [viewBox, setViewBox] = useState(defaultViewBox);
  const [centers, setCenters] = useState<Record<string, RegionCenter>>({});
  const [isLoading, setIsLoading] = useState(true);
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});

  const regionsById = useMemo(
    () => new Map(regions.map((region) => [region.id, region])),
    [regions]
  );

  const visiblePaths = useMemo(
    () => paths.filter((path) => regionsById.has(path.id)),
    [paths, regionsById]
  );

  useEffect(() => {
    const abortController = new AbortController();

    async function loadSvg() {
      try {
        setIsLoading(true);
        const response = await fetch('/maps/peru.svg', { signal: abortController.signal });
        const svgText = await response.text();
        const documentSvg = new DOMParser().parseFromString(svgText, 'image/svg+xml');
        const svgRoot = documentSvg.querySelector('svg');
        const pathNodes = Array.from(documentSvg.querySelectorAll('path'));

        const parsedPaths = pathNodes
          .map((pathNode) => ({
            id: pathNode.getAttribute('id') ?? '',
            title: pathNode.getAttribute('title') ?? '',
            d: pathNode.getAttribute('d') ?? '',
          }))
          .filter((pathNode) => pathNode.id && pathNode.title && pathNode.d);

        setPaths(parsedPaths);

        if (svgRoot) {
          const width = svgRoot.getAttribute('width') ?? '542.76703';
          const height = svgRoot.getAttribute('height') ?? '792';
          setViewBox(`0 0 ${width} ${height}`);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error('No se pudo cargar el SVG de Peru', error);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadSvg();

    return () => abortController.abort();
  }, []);

  useEffect(() => {
    if (visiblePaths.length === 0) return;

    const nextCenters: Record<string, RegionCenter> = {};

    visiblePaths.forEach((path) => {
      const pathNode = pathRefs.current[path.id];
      if (!pathNode) return;

      const bounds = pathNode.getBBox();
      nextCenters[path.id] = {
        x: bounds.x + bounds.width / 2,
        y: bounds.y + bounds.height / 2,
      };
    });

    setCenters(nextCenters);
  }, [visiblePaths]);

  if (isLoading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-border-subtle/60 bg-surface/55">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-gs-orange border-t-transparent" />
          <p className="text-sm text-text-secondary">Cargando mapa de Peru...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border-subtle/60 bg-surface/55 p-4 sm:p-5 lg:p-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-text-primary">Perú en vivo</p>
          <p className="text-xs text-text-muted">Explora las zonas con más movimiento.</p>
        </div>
        <div className="rounded-full border border-border-subtle/60 bg-mf-darker/50 px-3 py-1.5 text-xs text-text-secondary">
          {regions.length} zonas con actividad
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-border-subtle/50 bg-mf-darker/60">
        <svg viewBox={viewBox} className="h-auto w-full" role="img" aria-label="Mapa interactivo del Peru con cobertura operativa">
          <defs>
            <radialGradient id="coverageMapGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F3188F" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#F3188F" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="100%" height="100%" fill="#0B0E16" />

          <g>
            {visiblePaths.map((path) => {
              const region = regionsById.get(path.id);
              if (!region) return null;

              const isSelected = path.id === selectedRegionId;
              const fill = getRegionFill(region.intensity, isSelected);

              return (
                <path
                  key={path.id}
                  ref={(node) => {
                    pathRefs.current[path.id] = node;
                  }}
                  d={path.d}
                  fill={fill}
                  stroke={isSelected ? '#FFE5F3' : '#182233'}
                  strokeWidth={isSelected ? 2.6 : 1.4}
                  vectorEffect="non-scaling-stroke"
                  className="cursor-pointer transition-all duration-200 hover:opacity-90"
                  tabIndex={0}
                  onClick={() => onSelectRegion(path.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onSelectRegion(path.id);
                    }
                  }}
                >
                  <title>{`${path.title}: ${region.activeIps} IPs activas, ${region.tickets} tickets`}</title>
                </path>
              );
            })}
          </g>

          <g>
            {regions.map((region) => {
              const center = centers[region.id];
              if (!center || region.activeIps <= 0) return null;

              const radius = getBubbleRadius(region.activeIps);
              const isSelected = region.id === selectedRegionId;

              return (
                <g key={`bubble-${region.id}`} pointerEvents="none">
                  <circle cx={center.x} cy={center.y} r={radius + 10} fill="url(#coverageMapGlow)" opacity={isSelected ? 0.9 : 0.42} />
                  <circle cx={center.x} cy={center.y} r={radius} fill={isSelected ? '#FFE5F3' : '#F3188F'} opacity={isSelected ? 0.98 : 0.82} />
                  <text
                    x={center.x}
                    y={center.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isSelected ? '#0B0E16' : '#F5F7FB'}
                    fontSize={radius > 16 ? 11 : 10}
                    fontWeight="700"
                  >
                    {region.activeIps}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
