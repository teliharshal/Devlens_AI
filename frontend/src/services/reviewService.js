import api from './api';

/**
 * Fetch all code reviews from the backend.
 * Endpoint: GET /api/reviews/
 * @returns {Promise<Array>} List of code reviews ordered by created_at desc
 */
export const getReviews = async () => {
  const response = await api.get('/reviews/');
  return response.data;
};

/**
 * Fetch a single code review with nested issues by ID.
 * Endpoint: GET /api/reviews/:id/
 * @param {string|number} id - Review ID
 * @returns {Promise<Object>} Code review details including issues, summary, and improved_code
 */
export const getReviewById = async (id) => {
  if (!id) {
    throw new Error('Review ID is required to fetch details.');
  }
  const response = await api.get(`/reviews/${id}/`);
  return response.data;
};

/**
 * Submit code for AI-powered review.
 * Endpoint: POST /api/reviews/
 * @param {Object} reviewData - { title: string, language: string, code: string }
 * @returns {Promise<Object>} Created review object with synchronous analysis
 */
export const createReview = async (reviewData) => {
  const response = await api.post('/reviews/', reviewData);
  return response.data;
};
