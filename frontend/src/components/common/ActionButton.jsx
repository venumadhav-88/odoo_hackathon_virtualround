import React from 'react';
import { ButtonLoader } from '@/components/common/loading/ButtonLoader';

/**
 * ActionButton Component.
 * Standardised layout enclosing loaders, disabled states, custom icons, and theme colors.
 * @param {Object} props - Component properties.
 * @param {Function} [props.onClick] - Click event handler.
 * @param {string} [props.variant='primary'] - Variant styling keyword (primary, secondary, danger, success).
 * @param {boolean} [props.isLoading=false] - Spinner visibility flag.
 * @param {boolean} [props.disabled=false] - Disabled attribute trigger.
 * @param {React.ComponentType} [props.icon: Icon] - Optional prefix icon element.
 * @param {React.ReactNode} props.children - Button content nodes.
 * @param {string} [props.type='button'] - HTML button type trigger.
 * @param {string} [props.ariaLabel] - Accessibility name.
 * @returns {JSX.Element} Standard button layout.
 */
export const ActionButton = ({
  onClick,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  icon: Icon,
  children,
  type = 'button',
  ariaLabel,
}) => {
  const getButtonClass = () => {
    switch (variant) {
      case 'primary': return 'btn btn-primary';
      case 'secondary': return 'btn btn-secondary';
      case 'danger': return 'btn btn-danger';
      case 'success': return 'btn btn-success';
      default: return 'btn btn-primary';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${getButtonClass()} ${isLoading ? 'btn-loading' : ''}`}
      aria-label={ariaLabel}
    >
      {isLoading ? (
        <ButtonLoader />
      ) : (
        <>
          {Icon && <Icon size={16} />}
          {children}
        </>
      )}
    </button>
  );
};
