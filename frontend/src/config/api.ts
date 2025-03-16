export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const API_ROUTES = {
  // Auth routes
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  
  // Admin routes
  CLAIM_HISTORY: `${API_BASE_URL}/admin/claim-history`,
  CREATE_COUPON: `${API_BASE_URL}/admin/create-coupon`,
  DELETE_COUPON: `${API_BASE_URL}/admin/delete-coupon`,
  
  // Coupon routes
  CLAIM_COUPON: `${API_BASE_URL}/coupon/claim`,
  TOGGLE_COUPON: `${API_BASE_URL}/coupon/toggle`,
  GET_COUPONS: `${API_BASE_URL}/coupon/all`,
}; 