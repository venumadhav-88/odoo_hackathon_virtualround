import { devLogger } from './development';
import { prodLogger } from './production';

const isDev = import.meta.env.DEV;

/**
 * Conditional Logger exporter.
 * Exposes active logging capabilities in development, and completely silences console prints in production.
 */
export const logger = isDev ? devLogger : prodLogger;
