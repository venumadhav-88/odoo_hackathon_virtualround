import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { logger } from '@/utils/logger';

/**
 * Custom hook wrapping React Hook Form for asset maintenance schedule form fields.
 * @param {Object} config
 */
export const useMaintenanceForm = ({ defaultValues, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({ defaultValues });

  const handleFormSubmit = useCallback(
    async (data) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        await onSubmit(data);
      } catch (error) {
        logger.error('useMaintenanceForm submit callback failed:', error);
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
    watch,
    setValue,
  };
};
