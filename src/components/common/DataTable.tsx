import type { ReactNode } from 'react';

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  totalItems?: number;
}

function PaginationBar({
  page,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  onPageSizeChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  totalItems?: number;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
}) {
  const from = totalItems ? (page - 1) * (pageSize ?? 25) + 1 : 0;
  const to = totalItems ? Math.min(page * (pageSize ?? 25), totalItems) : 0;

  const pages: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-border-subtle/50 text-xs text-text-muted">
      <div className="flex items-center gap-2">
        {totalItems !== undefined && (
          <span>
            {from}–{to} de {totalItems}
          </span>
        )}
        {onPageSizeChange && (
          <select
            value={pageSize ?? 25}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-transparent border border-border-subtle/40 rounded px-1 py-0.5 text-xs"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-2 py-1 rounded hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        {pages.map((p, i) =>
          typeof p === 'string' ? (
            <span key={`ellipsis-${i}`} className="px-1">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-2 py-1 rounded min-w-[28px] text-center ${
                p === page ? 'bg-mf-pink/20 text-mf-pink font-semibold' : 'hover:bg-surface'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-2 py-1 rounded hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  page,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems,
}: DataTableProps<T>) {
  if (data.length === 0) return null;

  return (
    <div className="table-container">
      <table className="table-base">
        <thead className="table-head">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={`px-4 py-3 font-semibold ${col.className ?? ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              className={`table-row ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 ${col.className ?? ''}`}>
                  {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {page !== undefined && totalPages !== undefined && onPageChange && (
        <PaginationBar
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}
