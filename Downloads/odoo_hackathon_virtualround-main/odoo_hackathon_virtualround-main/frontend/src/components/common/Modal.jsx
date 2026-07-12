import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Modal Component.
 * Compound layout component wrapping modal overlays.
 * Supports Modal.Header, Modal.Body, and Modal.Footer composition.
 * @param {Object} props - Properties.
 * @param {boolean} props.isOpen - Visibility flag.
 * @param {Function} props.onClose - Close action.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {JSX.Element|null} The modal overlay.
 */
export const Modal = ({ isOpen, onClose, children, className = '' }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      const container = modalRef.current;
      if (!container) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    const focusTarget = modalRef.current?.querySelector(FOCUSABLE_SELECTOR);
    focusTarget?.focus();
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onClose} role="presentation">
      <div
        className={`dialog-card ${className}`}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * ModalHeader Subcomponent.
 * Renders the top border banner including close triggers.
 * @param {Object} props - Properties.
 * @param {React.ReactNode} props.children - Title node.
 * @param {Function} [props.onClose] - Optional close trigger.
 * @returns {JSX.Element} The modal header container.
 */
const ModalHeader = ({ children, onClose }) => {
  return (
    <div className="modal-header">
      <div className="modal-header-title">{children}</div>
      {onClose && (
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>
      )}
    </div>
  );
};

/**
 * ModalBody Subcomponent.
 * Encloses the central view layout.
 * @param {Object} props - Properties.
 * @param {React.ReactNode} props.children - Content nodes.
 * @returns {JSX.Element} The modal body container.
 */
const ModalBody = ({ children }) => {
  return <div className="modal-body">{children}</div>;
};

/**
 * ModalFooter Subcomponent.
 * Renders the bottom button layout.
 * @param {Object} props - Properties.
 * @param {React.ReactNode} props.children - Control nodes.
 * @returns {JSX.Element} The modal footer container.
 */
const ModalFooter = ({ children }) => {
  return <div className="modal-footer">{children}</div>;
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
