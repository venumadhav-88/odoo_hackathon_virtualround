import React from 'react';
import { TableLoader } from '@/components/common/loading/TableLoader';
import { NoDataState } from './NoDataState';

/**
 * DataTable Component.
 * Modular grid rendering engine mapping standard tables.
 * @param {Object} props - Component properties.
 * @param {Array} props.columns - Column specifications [{ key, header, render, width }].
 * @param {Array} props.rows - Row datasets list.
 * @param {boolean} [props.isLoading=false] - Activity loader state.
 * @param {string} [props.emptyMessage] - Fallback message.
 * @param {Function} [props.onRowClick] - Click event handler.
 * @param {Function} [props.rowActions] - Optional control options generator.
 * @param {Function} [props.keyExtractor] - ID selector from data records.
 * @returns {JSX.Element} Grid layout.
 */
export const DataTable = ({
  columns,
  rows,
  isLoading = false,
  emptyMessage,
  onRowClick,
  rowActions,
  keyExtractor = (row) => row.id || row.key,
}) => {
  if (isLoading) {
    return <TableLoader />;
  }

  if (!rows || rows.length === 0) {
    return <NoDataState description={emptyMessage} />;
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={col.key || index} style={col.width ? { width: col.width } : undefined}>
                {col.header}
              </th>
            ))}
            {rowActions && <th className="actions-header">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            const rowKey = keyExtractor(row) || rowIndex;
            return (
              <tr
                key={rowKey}
                onClick={() => onRowClick && onRowClick(row)}
                className={onRowClick ? 'clickable-row' : ''}
              >
                {columns.map((col, colIndex) => {
                  const cellValue = row[col.key];
                  return (
                    <td key={col.key || colIndex}>
                      {col.render ? col.render(cellValue, row) : cellValue}
                    </td>
                  );
                })}
                {rowActions && (
                  <td 
                    className="actions-cell" 
                    onClick={(e) => e.stopPropagation()}
                  >
                    {rowActions(row)}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
