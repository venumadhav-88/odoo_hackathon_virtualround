import React from 'react';
import { FolderOpen } from 'lucide-react';
import { EmptyState } from './EmptyState';

/**
 * NoDataState Component.
 * Fallback empty card indicating database check misses.
 * @param {Object} props - Properties.
 * @param {string} [props.title='No Data Available'] - Primary title.
 * @param {string} [props.description='There is currently no data in this section.'] - Detail description.
 * @returns {JSX.Element} Reusable empty state view.
 */
export const NoDataState = ({
  title = 'No Data Available',
  description = 'There is currently no data in this section.',
}) => {
  return (
    <EmptyState
      title={title}
      description={description}
      icon={FolderOpen}
    />
  );
};
