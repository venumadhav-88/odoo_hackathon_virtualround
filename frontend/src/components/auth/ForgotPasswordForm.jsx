import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthForm } from '@/hooks';
import { validateEmail } from '@/utils/validators';
import { AuthService } from '@/services';
import { ActionButton } from '@/components/common';
import { ROUTES } from '@/constants/routes';

/**
 * ForgotPasswordForm Component.
 * Recovery form collecting user email addresses to mock reset commands.
 * @returns {JSX.Element} Recovery layout.
 */
export const ForgotPasswordForm = () => {
  const navigate = useNavigate();

  const handleForgotSubmit = async (data) => {
    await AuthService.forgotPassword(data.email);
    navigate(ROUTES.LOGIN);
  };

  const { register, onSubmitHandler, errors, isLoading } = useAuthForm({
    defaultValues: { email: '' },
    onSubmit: handleForgotSubmit,
  });

  return (
    <form onSubmit={onSubmitHandler} className="auth-form" noValidate>
      <h1 className="auth-title">Forgot Password</h1>
      <p className="auth-subtitle">Enter your email to request recovery link</p>

      <div className="form-group auth-form-first-group">
        <label htmlFor="forgot-email" className="form-label">
          Email Address
        </label>
        <input
          id="forgot-email"
          type="email"
          placeholder="user@eam.local"
          disabled={isLoading}
          className={`form-input ${errors.email ? 'input-error' : ''}`}
          autoComplete="email"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'forgot-email-error' : undefined}
          {...register('email', {
            required: 'Email address is required.',
            validate: (value) => validateEmail(value) || 'Please enter a valid email address.',
          })}
        />
        {errors.email && (
          <span className="error-message" role="alert" id="forgot-email-error">
            {errors.email.message}
          </span>
        )}
      </div>

      <ActionButton
        type="submit"
        isLoading={isLoading}
        disabled={isLoading}
        variant="primary"
        className="btn btn-primary btn-full"
      >
        Send Recovery Link
      </ActionButton>

      <div className="auth-form-footer">
        <span>Back to</span>
        <Link to={ROUTES.LOGIN} className="auth-form-footer-link">
          Sign In
        </Link>
      </div>
    </form>
  );
};
