import { ReactNode } from 'react';
import { Trash2, Edit, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
  width?: string;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onTogglePublish?: (item: T) => void;
  getId?: (item: T) => string;
  sortKey?: string;
  sortAsc?: boolean;
  onSort?: (key: string) => void;
  emptyMessage?: string;
}

export function AdminTable<T>({
  columns,
  data,
  onEdit,
  onDelete,
  onTogglePublish,
  getId = (item: T) => (item as Record<string, unknown>).id as string,
  sortKey,
  sortAsc = true,
  onSort,
  emptyMessage = 'No items found.',
}: AdminTableProps<T>) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                style={{ width: col.width }}
                onClick={() => col.sortable && onSort?.(col.key)}
                className={col.sortable ? 'sortable' : ''}
              >
                <span className="th-inner">
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </span>
              </th>
            ))}
            {(onEdit || onDelete || onTogglePublish) && <th className="actions-col">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="empty-row">{emptyMessage}</td>
            </tr>
          ) : (
            data.map(item => (
              <tr key={getId(item)}>
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
                {(onEdit || onDelete || onTogglePublish) && (
                  <td className="actions-cell">
                    {onEdit && (
                      <button className="admin-btn-icon" title="Edit" onClick={() => onEdit(item)}>
                        <Edit size={16} />
                      </button>
                    )}
                    {onTogglePublish && (
                      <button className="admin-btn-icon" title="Toggle publish" onClick={() => onTogglePublish(item)}>
                        {(item as Record<string, unknown>).is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}
                    {onDelete && (
                      <button className="admin-btn-icon danger" title="Delete" onClick={() => onDelete(item)}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
