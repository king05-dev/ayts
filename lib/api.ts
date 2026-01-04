// API client for AYTS marketplace
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  defaultLocationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  name: string;
  city: string;
  province: string;
  postalCode?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface Store {
  id: string;
  vendorId: string;
  categoryId: string;
  locationId: string;
  name: string;
  description?: string;
  address: string;
  phone?: string;
  email?: string;
  operatingHours: Record<string, { open: string; close: string }>;
  deliveryRadiusKm: number;
  minimumOrderAmount: number;
  deliveryFee: number;
  bannerUrl?: string;
  logoUrl?: string;
  isVerified: boolean;
  isActive: boolean;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  location?: Location;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: Record<string, number>;
  inventoryCount: number;
  lowStockThreshold: number;
  images: string[];
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  store?: Store;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  createdAt: string;
  product?: Product;
}

export interface Cart {
  id: string;
  userId: string;
  storeId: string;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
  store?: Store;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  storeId: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  taxAmount: number;
  totalAmount: number;
  commissionAmount: number;
  vendorPayout: number;
  deliveryAddress: string;
  deliveryInstructions?: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderNotes?: string;
  vendorNotes?: string;
  adminNotes?: string;
  confirmedAt?: string;
  preparingAt?: string;
  readyAt?: string;
  deliveringAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  store?: Store;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}

export interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  businessType?: string;
  businessAddress?: string;
  contactPhone?: string;
  contactEmail?: string;
  tin?: string;
  dtiPermitNumber?: string;
  mayorPermitNumber?: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  commissionRate: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VendorApplication {
  id: string;
  userId: string;
  businessName: string;
  businessType?: string;
  businessAddress?: string;
  contactPhone?: string;
  contactEmail?: string;
  dtiPermitUrl?: string;
  mayorPermitUrl?: string;
  businessPermitUrl?: string;
  validIdUrl?: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'needs_more_info';
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  canReapply: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId?: string;
  vendorId?: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    
    // Load token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    return this.request<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async refreshToken() {
    return this.request<{ token: string }>('/api/auth/refresh', {
      method: 'POST',
    });
  }

  async logout() {
    const response = await this.request('/api/auth/logout', {
      method: 'POST',
    });
    this.clearToken();
    return response;
  }

  // User endpoints
  async getProfile() {
    return this.request<User>('/api/users/profile');
  }

  async updateProfile(userData: Partial<User>) {
    return this.request<User>('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getLocations() {
    return this.request<Location[]>('/api/stores/locations');
  }

  async setLocation(locationId: string) {
    return this.request('/api/users/location', {
      method: 'PUT',
      body: JSON.stringify({ locationId }),
    });
  }

  // Store endpoints
  async getStores(params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    locationId?: string;
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<Store[]>(
      `/api/stores?${searchParams.toString()}`
    );
  }

  async getStore(storeId: string) {
    return this.request<Store>(`/api/stores/${storeId}`);
  }

  async getCategories() {
    return this.request<Category[]>('/api/stores/categories');
  }

  async getStoreProducts(storeId: string, params?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<Product[]>(
      `/api/stores/${storeId}/products?${searchParams.toString()}`
    );
  }

  // Product endpoints
  async getProducts(params?: {
    page?: number;
    limit?: number;
    storeId?: string;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          // Map storeId to store parameter for backend compatibility
          const paramKey = key === 'storeId' ? 'store' : key;
          searchParams.append(paramKey, value.toString());
        }
      });
    }
    
    return this.request<{ products: Product[]; pagination: any }>(
      `/api/products?${searchParams.toString()}`
    );
  }

  async getProduct(productId: string) {
    return this.request<Product>(`/api/products/${productId}`);
  }

  // Cart endpoints
  async getCart() {
    return this.request<Cart>('/api/cart');
  }

  async addToCart(productId: string, quantity: number) {
    return this.request<Cart>('/api/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(itemId: string, quantity: number) {
    return this.request<Cart>(`/api/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(itemId: string) {
    return this.request<Cart>(`/api/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request('/api/cart/clear', {
      method: 'POST',
    });
  }

  async getCartSummary() {
    return this.request<any>('/api/cart/summary');
  }

  // Order endpoints
  async createOrder(orderData: {
    storeId: string;
    deliveryAddress: string;
    deliveryInstructions?: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    orderNotes?: string;
    paymentMethod: string;
  }) {
    return this.request<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{ orders: Order[]; pagination: any }>(
      `/api/orders?${searchParams.toString()}`
    );
  }

  async getOrder(orderId: string) {
    return this.request<Order>(`/api/orders/${orderId}`);
  }

  async updateOrderStatus(orderId: string, status: string, notes?: string) {
    return this.request<Order>(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  async cancelOrder(orderId: string, reason?: string) {
    return this.request<Order>(`/api/orders/${orderId}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  // Vendor endpoints
  async submitVendorApplication(applicationData: {
    businessName: string;
    businessType?: string;
    businessAddress?: string;
    contactPhone?: string;
    contactEmail?: string;
  }) {
    return this.request<{ application: VendorApplication }>('/vendors/apply', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  async getVendorApplication() {
    return this.request<{ application: VendorApplication }>('/vendors/application');
  }

  async getVendorProfile() {
    return this.request<{ vendor: Vendor }>('/vendors/profile');
  }

  async updateVendorProfile(profileData: Partial<Vendor>) {
    return this.request<{ vendor: Vendor }>('/vendors/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Admin endpoints
  async getDashboardStats() {
    return this.request<{ stats: any }>('/admin/dashboard');
  }

  async getVendorApplications(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{ applications: VendorApplication[]; pagination: any }>(
      `/admin/applications?${searchParams.toString()}`
    );
  }

  async reviewVendorApplication(applicationId: string, action: 'approve' | 'reject', notes?: string) {
    return this.request<{ application: VendorApplication }>(`/admin/applications/${applicationId}/review`, {
      method: 'PUT',
      body: JSON.stringify({ action, notes }),
    });
  }

  // Notification endpoints
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<{ notifications: Notification[]; pagination: any }>(
      `/notifications?${searchParams.toString()}`
    );
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async deleteNotification(notificationId: string) {
    return this.request(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  }

  async getUnreadNotificationCount() {
    return this.request<{ count: number }>('/notifications/unread-count');
  }
}

export const api = new ApiClient();
export default api;
