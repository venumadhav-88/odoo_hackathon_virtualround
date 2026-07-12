import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { logger } from '@/utils/logger';

/**
 * Custom hook wrapping React Hook Form for asset create/edit flows.
 * @param {Object} config
 * @param {Object} [config.defaultValues] - Initial form values.
 * @param {Function} config.onSubmit - Async callback invoked with validated data.
 * @returns {Object} Form bindings, errors, loading state, reset.
 */
export const useAssetForm = ({ defaultValues, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  const handleFormSubmit = useCallback(
    async (data) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        await onSubmit(data);
      } catch (error) {
        logger.error('useAssetForm submit callback failed:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, onSubmit]
  );

  return {
    register,
    onSubmitHandler: handleSubmit(handleFormSubmit),
    errors,
    isLoading,
    reset,
  };
};
