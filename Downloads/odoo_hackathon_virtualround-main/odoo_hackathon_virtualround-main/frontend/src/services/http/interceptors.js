/**
 * Registers request and response interceptors on the Axios client.
 * Prepares the client for future headers injection (e.g. JWT tokens).
 */
export const setupInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      // Future Integration: Inject auth token or standard headers
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
