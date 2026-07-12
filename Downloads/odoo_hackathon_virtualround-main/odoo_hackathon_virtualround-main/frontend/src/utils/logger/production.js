/**
 * Silent logger utility for production mode execution.
 * Suppresses all outputs to console for security and performance optimization.
 */
export const prodLogger = {
  log: () => {},
  warn: () => {},
  error: () => {},
  info: () => {},
};
