import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthForm } from '@/hooks';
import { validateEmail } from '@/utils/validators';
import { AuthService } from '@/services';
import { ActionButton } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { PasswordInput } from './PasswordInput';

/**
 * LoginForm Component.
 * Form rendering input fields for credentials, validation flags, and redirection handles.
 * @returns {JSX.Element} Login form layout.
 */
export const LoginForm = () => {
  const navigate = useNavigate();

  const handleLoginSubmit = async (data) => {
    await AuthService.login(data.email, data.password);
    navigate(ROUTES.DASHBOARD);
  };

  const { register, onSubmitHandler, errors, isLoading } = useAuthForm({
    defaultValues: { email: '', password: '', rememberMe: false },
    onSubmit: handleLoginSubmit,
  });

  return (
    <form onSubmit={onSubmitHandler} className="auth-form" noValidate>
      <h1 className="auth-title">Sign In</h1>
      <p className="auth-subtitle">Access the EAM inventory dashboard</p>

      <div className="form-group auth-form-first-group">
        <label htmlFor="login-email" className="form-label">
          Email Address
        </label>
        <input
          id="login-email"
          type="email"
          placeholder="admin@eam.local"
          disabled={isLoading}
          className={`form-input ${errors.email ? 'input-error' : ''}`}
          autoComplete="email"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'login-email-error' : undefined}
          {...register('email', {
            required: 'Email address is required.',
            validate: (value) => validateEmail(value) || 'Please enter a valid email address.',
          })}
        />
        {errors.email && (
          <span className="error-message" role="alert" id="login-email-error">
            {errors.email.message}
          </span>
        )}
      </div>

      <PasswordInput
        label="Password"
        id="login-password"
        name="password"
        register={register}
        validationRules={{
          required: 'Password is required.',
          minLength: {
            value: 6,
            message: 'Password must contain at least 6 characters.',
          },
        }}
        error={errors.password}
        disabled={isLoading}
        isLoading={isLoading}
        autocomplete="current-password"
      />

      <div className="form-actions-row">
        <label className="remember-me-checkbox">
          <input
            type="checkbox"
            disabled={isLoading}
            {...register('rememberMe')}
          />
          <span>Remember Me</span>
        </label>
        <Link to={ROUTES.FORGOT_PASSWORD} className="forgot-password-link">
          Forgot Password?
        </Link>
      </div>

      <ActionButton
        type="submit"
        isLoading={isLoading}
        disabled={isLoading}
        variant="primary"
        className="btn btn-primary btn-full"
      >
        Sign In
      </ActionButton>
    </form>
  );
};
