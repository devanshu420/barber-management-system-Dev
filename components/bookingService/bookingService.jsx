import API from '@/lib/api';

export const bookingService = {
  /**
   * Get all bookings for a specific shop
   * @param {string} shopId - The shop ID
   * @returns {Array} Array of bookings
   */
  getShopBookings: async (shopId) => {
    try {
      const response = await API.get(`/bookings/shop/${shopId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching shop bookings:', error);
      throw error;
    }
  },

  /**
   * Get a single booking by ID
   * @param {string} bookingId - The booking ID
   * @returns {Object} Booking object
   */
  getSingleBooking: async (bookingId) => {
    try {
      const response = await API.get(`/bookings/${bookingId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  /**
   * Confirm a booking (change status to confirmed)
   * @param {string} bookingId - The booking ID
   * @returns {Object} Updated booking object
   */
  confirmBooking: async (bookingId) => {
    try {
      const response = await API.patch(`/bookings/${bookingId}/status`, {
        status: 'confirmed'
      });
      return response.data.data;
    } catch (error) {
      console.error('Error confirming booking:', error);
      throw error;
    }
  },

  /**
   * Cancel a booking
   * @param {string} bookingId - The booking ID
   * @returns {Object} Updated booking object
   */
  cancelBooking: async (bookingId) => {
    try {
      const response = await API.patch(`/bookings/${bookingId}/cancel`);
      return response.data.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  },

  /**
   * Create a new booking
   * @param {Object} bookingData - Booking data
   * @returns {Object} Created booking object
   */
  createBooking: async (bookingData) => {
    try {
      const response = await API.post('/bookings', bookingData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  /**
   * Get all bookings for a user
   * @param {string} userId - The user ID
   * @returns {Array} Array of bookings
   */
  getUserBookings: async (userId) => {
    try {
      const response = await API.get(`/bookings/user/${userId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  },

  /**
   * Reschedule a booking
   * @param {string} bookingId - The booking ID
   * @param {Object} rescheduleData - New date/time data
   * @returns {Object} Updated booking object
   */
  rescheduleBooking: async (bookingId, rescheduleData) => {
    try {
      const response = await API.patch(`/bookings/${bookingId}/reschedule`, rescheduleData);
      return response.data.data;
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      throw error;
    }
  },

  /**
   * Add review to a booking
   * @param {string} bookingId - The booking ID
   * @param {Object} reviewData - Review data
   * @returns {Object} Updated booking object
   */
  addReview: async (bookingId, reviewData) => {
    try {
      const response = await API.post(`/bookings/${bookingId}/review`, reviewData);
      return response.data.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }
};

export default bookingService;