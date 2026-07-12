import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { ActionButton } from './ActionButton';

/**
 * ErrorState Component.
 * Fallback empty card indicating API request or connection failures.
 * @param {Object} props - Properties.
 * @param {string} [props.title='An Error Occurred'] - Primary title.
 * @param {string} [props.description='Something went wrong while fetching data.'] - Detail description.
 * @param {Function} [props.onRetry] - Click callback function to retry fetching data.
 * @returns {JSX.Element} Reusable error card.
 */
export const ErrorState = ({
  title = 'An Error Occurred',
  description = 'Something went wrong while fetching data.',
  onRetry,
}) => {
  const actionElement = onRetry ? (
    <ActionButton onClick={onRetry} variant="primary">
      Try Again
    </ActionButton>
  ) : null;

  return (
    <EmptyState
      title={title}
      description={description}
      icon={AlertTriangle}
      action={actionElement}
    />
  );
};
