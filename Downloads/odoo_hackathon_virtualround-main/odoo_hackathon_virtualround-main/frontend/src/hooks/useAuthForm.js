import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { logger } from '@/utils/logger';

/**
 * Custom hook encapsulating React Hook Form controllers and submission loading trackers.
 * Decouples visual views from React Hook Form API states.
 * @param {Object} config - Config parameters.
 * @param {Object} [config.defaultValues] - Initial inputs layout.
 * @param {Function} config.onSubmit - Submission callback.
 * @returns {Object} Form states and register binding properties.
 */
export const useAuthForm = ({ defaultValues, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({ defaultValues });

  const handleFormSubmit = useCallback(
    async (data) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        await onSubmit(data);
      } catch (error) {
        logger.error('useAuthForm form submission callback caught error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, onSubmit]
  );

  const onSubmitHandler = handleSubmit(handleFormSubmit);

  return {
    register,
    onSubmitHandler,
    errors,
    isLoading,
    reset,
    watch,
  };
};
