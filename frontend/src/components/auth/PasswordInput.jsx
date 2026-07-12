import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * PasswordInput Component.
 * Custom password input wrapper offering visibility toggles, disabled flags, loading state filters, and screen reader announcements.
 * @param {Object} props - Properties.
 * @param {string} props.label - Input visual label.
 * @param {string} props.id - Uniqueness identifier for access keys.
 * @param {string} props.name - Variable name for hook forms binding.
 * @param {Function} props.register - Hook forms registration handler.
 * @param {Object} [props.validationRules] - Constraints rules configuration.
 * @param {Object} [props.error] - Field errors details.
 * @param {boolean} [props.disabled=false] - Disabled attribute toggler.
 * @param {boolean} [props.isLoading=false] - Loading blocker state.
 * @param {string} [props.placeholder='••••••••'] - Display placeholder.
 * @param {string} [props.autocomplete='current-password'] - HTML autocomplete keyword.
 * @returns {JSX.Element} Password field layout.
 */
export const PasswordInput = ({
  label,
  id,
  name,
  register,
  validationRules,
  error,
  disabled = false,
  isLoading = false,
  placeholder = '••••••••',
  autocomplete = 'current-password',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleShow = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <div className="input-wrapper">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          className={`form-input password-input-field ${error ? 'input-error' : ''}`}
          autoComplete={autocomplete}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          {...(register && register(name, validationRules))}
        />
        {!disabled && !isLoading && (
          <button
            type="button"
            onClick={handleToggleShow}
            className="password-toggle-btn"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <span className="error-message" role="alert" id={`${id}-error`}>
          {error.message}
        </span>
      )}
    </div>
  );
};
