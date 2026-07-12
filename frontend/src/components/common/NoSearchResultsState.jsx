import React from 'react';
import { SearchX } from 'lucide-react';
import { EmptyState } from './EmptyState';

/**
 * NoSearchResultsState Component.
 * Fallback empty card indicating search query misses.
 * @param {Object} props - Properties.
 * @param {string} [props.searchTerm] - Optional query string.
 * @param {string} [props.title='No Results Found'] - Primary title.
 * @param {string} [props.description="We couldn't find any matches."] - Detail description.
 * @returns {JSX.Element} Reusable empty state view.
 */
export const NoSearchResultsState = ({
  searchTerm,
  title = 'No Results Found',
  description = "We couldn't find any matches.",
}) => {
  const desc = searchTerm
    ? `No records match "${searchTerm}". Please modify your filter keyword.`
    : description;

  return (
    <EmptyState
      title={title}
      description={desc}
      icon={SearchX}
    />
  );
};
