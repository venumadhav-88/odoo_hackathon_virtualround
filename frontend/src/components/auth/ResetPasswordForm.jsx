import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthForm } from '@/hooks';
import { AuthService } from '@/services';
import { ActionButton } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { PasswordInput } from './PasswordInput';

/**
 * ResetPasswordForm Component.
 * Form collecting new password credentials, validating minimum lengths and match checks.
 * @returns {JSX.Element} Reset password layout.
 */
export const ResetPasswordForm = () => {
  const navigate = useNavigate();

  const handleResetSubmit = async (data) => {
    await AuthService.resetPassword(data.password);
    navigate(ROUTES.LOGIN);
  };

  const { register, onSubmitHandler, errors, isLoading, watch } = useAuthForm({
    defaultValues: { password: '', confirmPassword: '' },
    onSubmit: handleResetSubmit,
  });

  const passwordValue = watch('password');

  return (
    <form onSubmit={onSubmitHandler} className="auth-form" noValidate>
      <h1 className="auth-title">Reset Password</h1>
      <p className="auth-subtitle">Enter your new credentials below</p>

      <div className="auth-form-first-group">
        <PasswordInput
          label="New Password"
          id="reset-password"
          name="password"
          register={register}
          validationRules={{
            required: 'New password is required.',
            minLength: {
              value: 6,
              message: 'Password must contain at least 6 characters.',
            },
          }}
          error={errors.password}
          disabled={isLoading}
          isLoading={isLoading}
          autocomplete="new-password"
        />
      </div>

      <PasswordInput
        label="Confirm New Password"
        id="reset-confirm-password"
        name="confirmPassword"
        register={register}
        validationRules={{
          required: 'Please confirm your password.',
          validate: (value) => value === passwordValue || 'Passwords do not match.',
        }}
        error={errors.confirmPassword}
        disabled={isLoading}
        isLoading={isLoading}
        autocomplete="new-password"
      />

      <ActionButton
        type="submit"
        isLoading={isLoading}
        disabled={isLoading}
        variant="primary"
        className="btn btn-primary btn-full"
      >
        Reset Password
      </ActionButton>

      <div className="auth-form-footer">
        <span>Return to</span>
        <Link to={ROUTES.LOGIN} className="auth-form-footer-link">
          Sign In
        </Link>
      </div>
    </form>
  );
};
