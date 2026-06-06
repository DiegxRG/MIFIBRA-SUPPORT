import logoMiFibraUrl from '@/assets/images/logo-mifibra.png';
import { formatDate } from '@/lib/utils';
import type { WhitelistEntry, WhitelistStatus } from '../types';

interface ExportOptions {
  entries: WhitelistEntry[];
  search: string;
  status: 'all' | WhitelistStatus;
}

function getStatusLabel(status: WhitelistStatus): string {
  switch (status) {
    case 'active':
      return 'Activa';
    case 'expired':
      return 'Expirada';
    case 'revoked':
      return 'Revocada';
    default:
      return status;
  }
}

function getExportDateStamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}-${hours}${minutes}`;
}

function getStatusFilterLabel(status: ExportOptions['status']): string {
  return status === 'all' ? 'Todos los estados' : getStatusLabel(status);
}

function formatExpiration(entry: WhitelistEntry): string {
  if (entry.status === 'revoked' && entry.revokedAt) {
    return `Revocada ${formatDate(entry.revokedAt)}`;
  }

  if (entry.status === 'expired') {
    return `Expirada ${formatDate(entry.expiresAt)}`;
  }

  return formatDate(entry.expiresAt);
}

async function getImageDataUrl(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function exportWhitelistToExcel({ entries, search, status }: ExportOptions) {
  const [{ default: ExcelJS }, { saveAs }] = await Promise.all([import('exceljs'), import('file-saver')]);
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Whitelist');
  const logoBase64 = await getImageDataUrl(logoMiFibraUrl);

  worksheet.properties.defaultRowHeight = 22;
  worksheet.views = [{ state: 'frozen', ySplit: 6 }];

  const logoId = workbook.addImage({ base64: logoBase64, extension: 'png' });
  worksheet.addImage(logoId, 'A1:B3');

  worksheet.mergeCells('C1:F2');
  worksheet.getCell('C1').value = 'Reporte Whitelist MiFibra';
  worksheet.getCell('C1').font = { name: 'Calibri', size: 20, bold: true, color: { argb: 'FFF5F7FB' } };
  worksheet.getCell('C1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF111420' } };
  worksheet.getCell('C1').alignment = { vertical: 'middle' };

  worksheet.mergeCells('C3:F3');
  worksheet.getCell('C3').value = `Generado ${formatDate(new Date().toISOString())}`;
  worksheet.getCell('C3').font = { size: 11, color: { argb: 'FFA3AEC2' } };

  worksheet.mergeCells('A5:B5');
  worksheet.getCell('A5').value = `Filtro: ${getStatusFilterLabel(status)}`;
  worksheet.getCell('A5').font = { size: 10, bold: true, color: { argb: 'FFF3188F' } };

  worksheet.mergeCells('C5:F5');
  worksheet.getCell('C5').value = `Busqueda: ${search || 'Sin filtro'}`;
  worksheet.getCell('C5').font = { size: 10, color: { argb: 'FFA3AEC2' } };

  const headerRow = worksheet.addRow(['IP cliente', 'Estado', 'Ticket', 'Expira / cierre', 'Agente', 'Registrado']);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFF5F7FB' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF181D2A' } };
    cell.border = { bottom: { style: 'thin', color: { argb: 'FF2B3448' } } };
  });

  entries.forEach((entry) => {
    const row = worksheet.addRow([
      entry.clientIP,
      getStatusLabel(entry.status),
      entry.ticketId,
      formatExpiration(entry),
      entry.agentName,
      formatDate(entry.registeredAt),
    ]);

    row.eachCell((cell) => {
      cell.border = { bottom: { style: 'thin', color: { argb: 'FF233047' } } };
      cell.alignment = { vertical: 'middle' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10131D' } };
      cell.font = { color: { argb: 'FFF5F7FB' } };
    });

    row.getCell(2).font = {
      bold: true,
      color: { argb: entry.status === 'active' ? 'FF22C55E' : entry.status === 'revoked' ? 'FFF59E0B' : 'FFEF4444' },
    };
  });

  worksheet.columns = [
    { width: 18 },
    { width: 14 },
    { width: 16 },
    { width: 28 },
    { width: 20 },
    { width: 22 },
  ];

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    `MiFibra-Whitelist-${getExportDateStamp()}.xlsx`
  );
}

export async function exportWhitelistToPdf({ entries, search, status }: ExportOptions) {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const logoBase64 = await getImageDataUrl(logoMiFibraUrl);

  doc.setFillColor(9, 9, 18);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 92, 'F');
  doc.addImage(logoBase64, 'PNG', 36, 22, 82, 34);
  doc.setTextColor(245, 247, 251);
  doc.setFontSize(20);
  doc.text('Reporte Whitelist MiFibra', 132, 42);
  doc.setFontSize(10);
  doc.setTextColor(163, 174, 194);
  doc.text(`Generado ${formatDate(new Date().toISOString())}`, 132, 62);
  doc.text(`Filtro: ${getStatusFilterLabel(status)} | Busqueda: ${search || 'Sin filtro'}`, 36, 110);

  autoTable(doc, {
    startY: 126,
    head: [['IP cliente', 'Estado', 'Ticket', 'Expira / cierre', 'Agente', 'Registrado']],
    body: entries.map((entry) => [
      entry.clientIP,
      getStatusLabel(entry.status),
      entry.ticketId,
      formatExpiration(entry),
      entry.agentName,
      formatDate(entry.registeredAt),
    ]),
    styles: {
      fillColor: [16, 19, 29],
      textColor: [245, 247, 251],
      lineColor: [43, 52, 72],
      lineWidth: 0.5,
      fontSize: 9,
      cellPadding: 8,
    },
    headStyles: {
      fillColor: [24, 29, 42],
      textColor: [245, 247, 251],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [20, 26, 38],
    },
    margin: { left: 36, right: 36 },
  });

  doc.save(`MiFibra-Whitelist-${getExportDateStamp()}.pdf`);
}
