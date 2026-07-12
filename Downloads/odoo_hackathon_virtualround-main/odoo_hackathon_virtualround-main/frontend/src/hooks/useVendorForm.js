import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { logger } from '@/utils/logger';

export const useVendorForm = ({ defaultValues, onSubmit }) => {
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
        logger.error('useVendorForm submit callback failed:', error);
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