/**
 * Planyo API Service
 * Handles all communication with Planyo reservation system
 */

const API_BASE_URL = process.env.REACT_APP_PLANYO_API_URL || 'https://api.planyo.com';
const API_KEY = process.env.REACT_APP_PLANYO_API_KEY;

/**
 * Generic API request handler
 */
const apiRequest = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request Failed [${endpoint}]:`, error);
    throw error;
  }
};

/**
 * Fetch all reservations for a date range
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} Array of reservation objects
 */
export const fetchReservations = async (startDate, endDate) => {
  try {
    const data = await apiRequest(
      `/api/get_reservations?start=${startDate}&end=${endDate}`
    );
    return data.reservations || [];
  } catch (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
};

/**
 * Fetch detailed information for a specific reservation
 * @param {string} reservationId - Reservation ID
 * @returns {Promise<Object>} Reservation details
 */
export const fetchClientDetails = async (reservationId) => {
  try {
    const data = await apiRequest(`/api/get_reservation/${reservationId}`);
    return data.reservation || {};
  } catch (error) {
    console.error('Error fetching client details:', error);
    throw error;
  }
};

/**
 * Check in a client
 * @param {string} reservationId - Reservation ID
 * @returns {Promise<Object>} API response
 */
export const checkInClient = async (reservationId) => {
  try {
    return await apiRequest('/api/checkin', {
      method: 'POST',
      body: JSON.stringify({ reservation_id: reservationId }),
    });
  } catch (error) {
    console.error('Error checking in client:', error);
    throw error;
  }
};

/**
 * Check out a client
 * @param {string} reservationId - Reservation ID
 * @returns {Promise<Object>} API response
 */
export const checkOutClient = async (reservationId) => {
  try {
    return await apiRequest('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ reservation_id: reservationId }),
    });
  } catch (error) {
    console.error('Error checking out client:', error);
    throw error;
  }
};

/**
 * Cancel a reservation
 * @param {string} reservationId - Reservation ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<Object>} API response
 */
export const cancelReservation = async (reservationId, reason = 'Cancelled by admin') => {
  try {
    return await apiRequest('/api/cancel_reservation', {
      method: 'POST',
      body: JSON.stringify({
        reservation_id: reservationId,
        reason,
      }),
    });
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    throw error;
  }
};

/**
 * Process a refund
 * @param {string} reservationId - Reservation ID
 * @param {number} amount - Refund amount
 * @returns {Promise<Object>} API response
 */
export const processRefund = async (reservationId, amount) => {
  try {
    return await apiRequest('/api/refund', {
      method: 'POST',
      body: JSON.stringify({
        reservation_id: reservationId,
        amount,
      }),
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
};

/**
 * Fetch all available services
 * @returns {Promise<Array>} Array of service objects
 */
export const fetchServices = async () => {
  try {
    const data = await apiRequest('/api/get_services');
    return data.services || [];
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

/**
 * Update reservation time
 * @param {string} reservationId - Reservation ID
 * @param {string} newStart - New start time
 * @param {string} newEnd - New end time
 * @param {string} serviceId - Service ID (optional)
 * @returns {Promise<Object>} API response
 */
export const updateReservationTime = async (reservationId, newStart, newEnd, serviceId = null) => {
  try {
    const body = {
      reservation_id: reservationId,
      start_time: newStart,
      end_time: newEnd,
    };

    if (serviceId) {
      body.service_id = serviceId;
    }

    return await apiRequest('/api/modify_reservation', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error('Error updating reservation time:', error);
    throw error;
  }
};

/**
 * Create a new reservation (manual check-in)
 * @param {Object} reservationData - Reservation details
 * @returns {Promise<Object>} API response
 */
export const createReservation = async (reservationData) => {
  try {
    return await apiRequest('/api/create_reservation', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};

/**
 * Get reservation statistics
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise<Object>} Statistics object
 */
export const fetchReservationStats = async (startDate, endDate) => {
  try {
    const data = await apiRequest(
      `/api/get_stats?start=${startDate}&end=${endDate}`
    );
    return data.stats || {};
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};
