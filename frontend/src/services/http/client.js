import axios from 'axios';
import { ENV } from '@/config/env';
import { setupInterceptors } from './interceptors';
import { responseHandler } from './responseHandler';

const httpClient = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Attach standard request interceptors
setupInterceptors(httpClient);

// Attach unified success/error handlers
httpClient.interceptors.response.use(
  responseHandler.handleResponse,
  responseHandler.handleError
);

/**
 * Standard client instance to handle API calls.
 */
export const http = httpClient;
