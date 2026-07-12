import React from 'react';
import { X } from 'lucide-react';

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
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className={`dialog-card ${className}`} onClick={(e) => e.stopPropagation()}>
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
