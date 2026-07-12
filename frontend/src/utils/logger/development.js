/**
 * Active logger utility for development mode execution.
 * Prints output to browser developer console.
 */
export const devLogger = {
  log: (...args) => console.log('[EAM LOG]:', ...args),
  warn: (...args) => console.warn('[EAM WARN]:', ...args),
  error: (...args) => console.error('[EAM ERROR]:', ...args),
  info: (...args) => console.info('[EAM INFO]:', ...args),
};
