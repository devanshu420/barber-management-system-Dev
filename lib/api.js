const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = localStorage.getItem("token")

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "API request failed")
      }

      return data
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  // Authentication
  async login(credentials) {
    return this.request("/auth/login", {
      method: "POST",
      body: credentials,
    })
  }

  async register(userData) {
    return this.request("/auth/register", {
      method: "POST",
      body: userData,
    })
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    })
  }

  async refreshToken() {
    return this.request("/auth/refresh", {
      method: "POST",
    })
  }

  // User Profile
  async getProfile() {
    return this.request("/auth/profile")
  }

  async updateProfile(profileData) {
    return this.request("/auth/profile", {
      method: "PUT",
      body: profileData,
    })
  }

  // Services
  async getServices() {
    return this.request("/services")
  }

  async createService(serviceData) {
    return this.request("/services", {
      method: "POST",
      body: serviceData,
    })
  }

  // Barbers
  async getBarbers(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    return this.request(`/barbers${queryParams ? `?${queryParams}` : ""}`)
  }

  async getBarberById(id) {
    return this.request(`/barbers/${id}`)
  }

  async updateBarberProfile(profileData) {
    return this.request("/barbers/profile", {
      method: "PUT",
      body: profileData,
    })
  }

  // Bookings
  async createBooking(bookingData) {
    return this.request("/bookings", {
      method: "POST",
      body: bookingData,
    })
  }

  async getBookings(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    return this.request(`/bookings${queryParams ? `?${queryParams}` : ""}`)
  }

  async getBookingById(id) {
    return this.request(`/bookings/${id}`)
  }

  async updateBooking(id, updateData) {
    return this.request(`/bookings/${id}`, {
      method: "PUT",
      body: updateData,
    })
  }

  async cancelBooking(id) {
    return this.request(`/bookings/${id}/cancel`, {
      method: "PUT",
    })
  }

  async rescheduleBooking(id, newDateTime) {
    return this.request(`/bookings/${id}/reschedule`, {
      method: "PUT",
      body: { newDateTime },
    })
  }

  // Admin
  async getAdminStats() {
    return this.request("/admin/stats")
  }

  async getAllUsers() {
    return this.request("/admin/users")
  }

  async getAllBookings() {
    return this.request("/admin/bookings")
  }

  async updateUserStatus(userId, status) {
    return this.request(`/admin/users/${userId}/status`, {
      method: "PUT",
      body: { status },
    })
  }

  // Payments
  async processPayment(paymentData) {
    return this.request("/payments/process", {
      method: "POST",
      body: paymentData,
    })
  }

  async getPaymentHistory() {
    return this.request("/payments/history")
  }

  // Notifications
  async getNotifications() {
    return this.request("/notifications")
  }

  async markNotificationRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: "PUT",
    })
  }
}

export const apiService = new ApiService()
