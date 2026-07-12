import React, { useEffect } from 'react';
import { useCategoryForm } from '@/hooks';
import { ActionButton } from '@/components/common';

/**
 * CategoryForm Component.
 * Form collecting name, code, description and active status filters.
 * @param {Object} props - Properties.
 * @param {Object} [props.category] - Optional category details for edit/view modes.
 * @param {string} [props.mode='create'] - Display layout mode (create, edit, view).
 * @param {Function} props.onSubmit - Triggered on valid form submission.
 * @param {Function} props.onCancel - Cancel or close action triggers.
 * @returns {JSX.Element} Category inputs form.
 */
export const CategoryForm = ({
  category,
  mode = 'create',
  onSubmit,
  onCancel,
}) => {
  const isViewMode = mode === 'view';

  const { register, onSubmitHandler, errors, isLoading, reset } = useCategoryForm({
    defaultValues: {
      code: category?.code || '',
      name: category?.name || '',
      description: category?.description || '',
      status: category?.status || 'active',
    },
    onSubmit,
  });

  useEffect(() => {
    if (category) {
      reset({
        code: category.code,
        name: category.name,
        description: category.description,
        status: category.status,
      });
    } else {
      reset({
        code: '',
        name: '',
        description: '',
        status: 'active',
      });
    }
  }, [category, reset]);

  return (
    <form onSubmit={onSubmitHandler} noValidate>
      <div className="form-group">
        <label htmlFor="category-code" className="form-label">
          Category Code
        </label>
        <input
          id="category-code"
          type="text"
          disabled={isViewMode || isLoading || mode === 'edit'}
          placeholder="e.g. IT, FUR, NET"
          className={`form-input ${errors.code ? 'input-error' : ''}`}
          {...register('code', {
            required: 'Category code is required.',
            maxLength: {
              value: 10,
              message: 'Code cannot exceed 10 characters.',
            },
            setValueAs: (value) => value.trim(),
          })}
        />
        {errors.code && (
          <span className="error-message" role="alert">
            {errors.code.message}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="category-name" className="form-label">
          Category Name
        </label>
        <input
          id="category-name"
          type="text"
          disabled={isViewMode || isLoading}
          placeholder="e.g. Information Technology"
          className={`form-input ${errors.name ? 'input-error' : ''}`}
          {...register('name', {
            required: 'Category name is required.',
            maxLength: {
              value: 50,
              message: 'Name cannot exceed 50 characters.',
            },
            setValueAs: (value) => value.trim(),
          })}
        />
        {errors.name && (
          <span className="error-message" role="alert">
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="category-description" className="form-label">
          Description
        </label>
        <textarea
          id="category-description"
          disabled={isViewMode || isLoading}
          placeholder="Enter category description..."
          rows={3}
          className={`form-input ${errors.description ? 'input-error' : ''}`}
          {...register('description', {
            maxLength: {
              value: 200,
              message: 'Description cannot exceed 200 characters.',
            },
            setValueAs: (value) => value.trim(),
          })}
        />
        {errors.description && (
          <span className="error-message" role="alert">
            {errors.description.message}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="category-status" className="form-label">
          Status
        </label>
        <select
          id="category-status"
          disabled={isViewMode || isLoading}
          className="filters-select form-input"
          {...register('status', {
            required: 'Status is required.',
          })}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status && (
          <span className="error-message" role="alert">
            {errors.status.message}
          </span>
        )}
      </div>

      <div className="modal-footer">
        <ActionButton
          onClick={onCancel}
          variant="secondary"
          disabled={isLoading}
        >
          {isViewMode ? 'Close' : 'Cancel'}
        </ActionButton>
        {!isViewMode && (
          <ActionButton
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
            variant="primary"
          >
            {mode === 'create' ? 'Create Category' : 'Save Changes'}
          </ActionButton>
        )}
      </div>
    </form>
  );
};
