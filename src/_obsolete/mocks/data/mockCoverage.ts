import type { CoverageRegionMetric } from '../../features/coverage/types';

type CoverageSeed = Omit<CoverageRegionMetric, 'level' | 'intensity'>;

export const mockCoverageSeeds: CoverageSeed[] = [
  { id: 'PE-LIM', name: 'Lima', activeIps: 82, revokedIps: 9, expiredIps: 14, tickets: 35 },
  { id: 'PE-CAL', name: 'Callao', activeIps: 34, revokedIps: 4, expiredIps: 7, tickets: 16 },
  { id: 'PE-ARE', name: 'Arequipa', activeIps: 52, revokedIps: 6, expiredIps: 8, tickets: 23 },
  { id: 'PE-LAL', name: 'La Libertad', activeIps: 46, revokedIps: 4, expiredIps: 9, tickets: 19 },
  { id: 'PE-PIU', name: 'Piura', activeIps: 41, revokedIps: 5, expiredIps: 10, tickets: 18 },
  { id: 'PE-CUS', name: 'Cusco', activeIps: 39, revokedIps: 5, expiredIps: 8, tickets: 17 },
  { id: 'PE-LAM', name: 'Lambayeque', activeIps: 29, revokedIps: 3, expiredIps: 6, tickets: 13 },
  { id: 'PE-ANC', name: 'Ancash', activeIps: 27, revokedIps: 2, expiredIps: 5, tickets: 11 },
  { id: 'PE-JUN', name: 'Junín', activeIps: 33, revokedIps: 4, expiredIps: 6, tickets: 15 },
  { id: 'PE-ICA', name: 'Ica', activeIps: 24, revokedIps: 2, expiredIps: 5, tickets: 10 },
  { id: 'PE-PUN', name: 'Puno', activeIps: 19, revokedIps: 2, expiredIps: 3, tickets: 8 },
  { id: 'PE-AYA', name: 'Ayacucho', activeIps: 14, revokedIps: 2, expiredIps: 4, tickets: 7 },
  { id: 'PE-HUV', name: 'Huancavelica', activeIps: 10, revokedIps: 1, expiredIps: 2, tickets: 5 },
  { id: 'PE-HUC', name: 'Huánuco', activeIps: 17, revokedIps: 2, expiredIps: 3, tickets: 8 },
  { id: 'PE-PAS', name: 'Pasco', activeIps: 12, revokedIps: 1, expiredIps: 2, tickets: 6 },
  { id: 'PE-UCA', name: 'Ucayali', activeIps: 16, revokedIps: 3, expiredIps: 4, tickets: 8 },
  { id: 'PE-LOR', name: 'Loreto', activeIps: 21, revokedIps: 3, expiredIps: 5, tickets: 11 },
  { id: 'PE-SAM', name: 'San Martín', activeIps: 18, revokedIps: 2, expiredIps: 4, tickets: 9 },
  { id: 'PE-AMA', name: 'Amazonas', activeIps: 9, revokedIps: 1, expiredIps: 2, tickets: 4 },
  { id: 'PE-CAJ', name: 'Cajamarca', activeIps: 22, revokedIps: 3, expiredIps: 5, tickets: 10 },
  { id: 'PE-APU', name: 'Apurímac', activeIps: 8, revokedIps: 1, expiredIps: 2, tickets: 4 },
  { id: 'PE-MDD', name: 'Madre de Dios', activeIps: 7, revokedIps: 1, expiredIps: 1, tickets: 3 },
  { id: 'PE-MOQ', name: 'Moquegua', activeIps: 11, revokedIps: 1, expiredIps: 2, tickets: 5 },
  { id: 'PE-TAC', name: 'Tacna', activeIps: 13, revokedIps: 2, expiredIps: 2, tickets: 6 },
  { id: 'PE-TUM', name: 'Tumbes', activeIps: 6, revokedIps: 1, expiredIps: 1, tickets: 3 },
];
