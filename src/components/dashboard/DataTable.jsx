import './dashboard.css';
import EmptyState from './EmptyState';
import { Skeleton } from './Skeleton';

/**
 * Generic table.
 * columns: [{ key, header, render?(row), align? }]
 * loading → skeleton rows; empty → EmptyState.
 */
const DataTable = ({ columns, rows, loading, rowKey = (r, i) => r.id ?? i, empty }) => {
  if (loading) {
    return (
      <div className="dash-card__body">
        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skel skel-row" />)}
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return empty || <EmptyState title="Nothing here yet" message="Data will appear once available." />;
  }

  return (
    <div className="dash-table-wrap">
      <table className="dash-table">
        <thead>
          <tr>{columns.map(c => <th key={c.key} style={c.align ? { textAlign: c.align } : undefined}>{c.header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={rowKey(row, i)}>
              {columns.map(c => (
                <td key={c.key} style={c.align ? { textAlign: c.align } : undefined}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
