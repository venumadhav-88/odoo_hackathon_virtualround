import React from 'react';
import { FileDown, Printer, FileSpreadsheet } from 'lucide-react';
import { ActionButton } from '@/components/common';
import { notify } from '@/utils/notifications';

/**
 * ExportPanel Component.
 * Presentational export options toolbar.
 */
export const ExportPanel = () => {
  const handleExportCSV = () => {
    notify.success('Consolidating data columns into CSV download… (Mock Only)');
  };

  const handleExportPDF = () => {
    notify.success('Formatting report grids into PDF document… (Mock Only)');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        padding: '0.625rem 1rem',
        borderRadius: 'var(--radius-md)',
        width: 'fit-content',
      }}
    >
      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)', marginRight: '0.5rem' }}>
        Export:
      </span>
      <ActionButton
        onClick={handleExportCSV}
        icon={FileSpreadsheet}
        variant="secondary"
        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
      >
        CSV
      </ActionButton>
      <ActionButton
        onClick={handleExportPDF}
        icon={FileDown}
        variant="secondary"
        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
      >
        PDF
      </ActionButton>
      <ActionButton
        onClick={handlePrint}
        icon={Printer}
        variant="primary"
        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
      >
        Print
      </ActionButton>
    </div>
  );
};
