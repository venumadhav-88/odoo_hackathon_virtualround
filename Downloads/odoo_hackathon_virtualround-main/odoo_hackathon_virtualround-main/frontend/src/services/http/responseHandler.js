/**
 * Helper methods to normalize API response structures and standardise error formats.
 */
export const responseHandler = {
  /**
   * Standardises and extracts the payload from successful responses.
   * @param {Object} response - The Axios response payload.
   * @returns {*} Normalized data payload.
   */
  handleResponse(response) {
    return response?.data ?? null;
  },

  /**
   * Normalises and formats request failures into a structured layout.
   * @param {Object} error - The Axios error metadata.
   * @returns {Promise} Rejection containing normalized error details.
   */
  handleError(error) {
    const errorPayload = {
      message: 'An unexpected connection error occurred.',
      status: error.response?.status ?? null,
      data: error.response?.data ?? null,
    };

    if (error.response) {
      errorPayload.message = error.response.data?.detail || 
                             error.response.data?.message || 
                             `Request failed with status ${error.response.status}`;
    } else if (error.request) {
      errorPayload.message = 'Network connectivity issues. Please check your internet connection.';
    } else {
      errorPayload.message = error.message;
    }

    return Promise.reject(errorPayload);
  },
};
