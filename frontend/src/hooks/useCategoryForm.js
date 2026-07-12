import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { logger } from '@/utils/logger';

/**
 * Custom hook to handle Category form actions.
 * Decouples categories creation/modification views from form API states.
 * @param {Object} config - Configurations.
 * @param {Object} [config.defaultValues] - Initial inputs.
 * @param {Function} config.onSubmit - Callback when form passes client validations.
 * @returns {Object} React Hook Form properties.
 */
export const useCategoryForm = ({ defaultValues, onSubmit }) => {
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
        logger.error('useCategoryForm submit callback caught error:', error);
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
  };
};
