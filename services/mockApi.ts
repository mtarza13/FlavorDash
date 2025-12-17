
import { Product, User, Order, CartItem, ApiResponse } from '../types';
import { MOCK_PRODUCTS } from '../constants';

// --- Mock Database Keys ---
const DB_USERS = 'fd_users';
const DB_PRODUCTS = 'fd_products';
const DB_ORDERS = 'fd_orders';
const DB_CURRENT_USER = 'fd_current_user';

// --- Cache Layer ---
const requestCache = new Map<string, any>();

// --- Helper: Delay ---
const delay = (ms: number, isCached = false) => new Promise(resolve => setTimeout(resolve, isCached ? 50 : ms));

// --- Helper: Simulate Backend Process (Kitchen Workflow) ---
const simulateOrderProgress = (orderId: string) => {
  const timings = [5000, 10000, 15000]; // ms to next stage

  // 1. Pending -> Preparing
  setTimeout(() => {
    mockOrders.updateStatus(orderId, 'preparing');
  }, timings[0]);

  // 2. Preparing -> Delivering
  setTimeout(() => {
    mockOrders.updateStatus(orderId, 'delivering');
  }, timings[1]);

  // 3. Delivering -> Delivered
  setTimeout(() => {
    mockOrders.updateStatus(orderId, 'delivered');
  }, timings[2]);
};

const initDB = () => {
  if (!localStorage.getItem(DB_PRODUCTS)) {
    localStorage.setItem(DB_PRODUCTS, JSON.stringify(MOCK_PRODUCTS));
  }
  if (!localStorage.getItem(DB_USERS)) {
    const admin: User = { id: 'admin', name: 'Admin User', email: 'admin@flavor.dash', role: 'admin', phone: '555-0199', favorites: [] };
    localStorage.setItem(DB_USERS, JSON.stringify([admin]));
  }
  if (!localStorage.getItem(DB_ORDERS)) {
    localStorage.setItem(DB_ORDERS, JSON.stringify([]));
  }
};

initDB();

// --- Auth Services ---
export const mockAuth = {
  login: async (email: string, password: string): Promise<ApiResponse<User>> => {
    await delay(800);
    if (email === 'admin@flavor.dash' && password === 'admin') {
      const users = JSON.parse(localStorage.getItem(DB_USERS) || '[]');
      const admin = users.find((u: User) => u.email === email);
      const userWithToken = { ...admin, token: 'mock-jwt-admin-token' };
      localStorage.setItem(DB_CURRENT_USER, JSON.stringify(userWithToken));
      return { success: true, data: userWithToken };
    }
    const users = JSON.parse(localStorage.getItem(DB_USERS) || '[]');
    const user = users.find((u: User) => u.email === email);
    if (user) {
      const userWithToken = { ...user, token: `mock-jwt-${user.id}` };
      localStorage.setItem(DB_CURRENT_USER, JSON.stringify(userWithToken));
      return { success: true, data: userWithToken };
    }
    return { success: false, message: 'Invalid credentials' };
  },

  register: async (name: string, email: string, phone: string, password: string): Promise<ApiResponse<User>> => {
    await delay(1000);
    const users = JSON.parse(localStorage.getItem(DB_USERS) || '[]');
    if (users.find((u: User) => u.email === email)) {
      return { success: false, message: 'Email already exists' };
    }
    const newUser: User = { id: Date.now().toString(), name, email, phone, role: 'user', favorites: [] };
    users.push(newUser);
    localStorage.setItem(DB_USERS, JSON.stringify(users));
    const userWithToken = { ...newUser, token: `mock-jwt-${newUser.id}` };
    localStorage.setItem(DB_CURRENT_USER, JSON.stringify(userWithToken));
    return { success: true, data: userWithToken };
  },

  logout: async () => {
    localStorage.removeItem(DB_CURRENT_USER);
  },

  getCurrentUser: (): User | null => {
    const u = localStorage.getItem(DB_CURRENT_USER);
    return u ? JSON.parse(u) : null;
  },

  updateUser: (user: User) => {
    localStorage.setItem(DB_CURRENT_USER, JSON.stringify(user));
    const users = JSON.parse(localStorage.getItem(DB_USERS) || '[]');
    const idx = users.findIndex((u: User) => u.id === user.id);
    if(idx !== -1) {
        users[idx] = user;
        localStorage.setItem(DB_USERS, JSON.stringify(users));
    }
  }
};

// --- Product Services ---
export const mockProducts = {
  getAll: async (page = 1, limit = 10): Promise<ApiResponse<{ products: Product[], hasMore: boolean }>> => {
    const cacheKey = `products_${page}_${limit}`;
    if (requestCache.has(cacheKey)) {
      await delay(100, true); 
      return { success: true, data: requestCache.get(cacheKey) };
    }

    await delay(600);
    const allProducts = JSON.parse(localStorage.getItem(DB_PRODUCTS) || '[]');
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedProducts = allProducts.slice(start, end);
    const hasMore = end < allProducts.length;

    const result = { products: paginatedProducts, hasMore };
    requestCache.set(cacheKey, result);
    return { success: true, data: result };
  },

  add: async (product: Omit<Product, 'id'>): Promise<ApiResponse<Product>> => {
    await delay(600);
    const products = JSON.parse(localStorage.getItem(DB_PRODUCTS) || '[]');
    const newProduct = { ...product, id: Date.now().toString() };
    products.push(newProduct);
    localStorage.setItem(DB_PRODUCTS, JSON.stringify(products));
    requestCache.clear();
    return { success: true, data: newProduct };
  },

  update: async (product: Product): Promise<ApiResponse<Product>> => {
    await delay(600);
    const products = JSON.parse(localStorage.getItem(DB_PRODUCTS) || '[]');
    const index = products.findIndex((p: Product) => p.id === product.id);
    if (index === -1) return { success: false, message: 'Product not found' };
    products[index] = product;
    localStorage.setItem(DB_PRODUCTS, JSON.stringify(products));
    requestCache.clear();
    return { success: true, data: product };
  },

  delete: async (id: string): Promise<ApiResponse<boolean>> => {
    await delay(500);
    let products = JSON.parse(localStorage.getItem(DB_PRODUCTS) || '[]');
    products = products.filter((p: Product) => p.id !== id);
    localStorage.setItem(DB_PRODUCTS, JSON.stringify(products));
    requestCache.clear();
    return { success: true, data: true };
  }
};

// --- Order Services ---
interface CreateOrderParams {
  userId: string;
  items: CartItem[];
  subtotal: number;
  address: string;
  phone: string;
  paymentMethod: 'card' | 'cash' | 'apple_pay';
  cardLast4?: string;
  instructions?: string;
}

export const mockOrders = {
  create: async (params: CreateOrderParams): Promise<ApiResponse<Order>> => {
    await delay(1500); // Simulate network processing

    const { userId, items, subtotal, address, phone, paymentMethod, cardLast4, instructions } = params;

    // Backend Logic: Calculate totals securely on server side
    const deliveryFee = 2.50;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + deliveryFee + tax;
    
    // Logic: If Cash, status is Pending payment. If Card, it's Paid.
    const paymentStatus = paymentMethod === 'cash' ? 'pending' : 'paid';

    const orders = JSON.parse(localStorage.getItem(DB_ORDERS) || '[]');
    const newOrder: Order = {
      id: Date.now().toString(),
      userId,
      items,
      subtotal,
      deliveryFee,
      tax,
      total,
      date: new Date().toISOString(),
      status: 'pending',
      paymentMethod,
      paymentStatus,
      address,
      phone,
      instructions,
      cardLast4
    };
    
    orders.unshift(newOrder);
    localStorage.setItem(DB_ORDERS, JSON.stringify(orders));
    
    // Start Kitchen Simulation
    simulateOrderProgress(newOrder.id);
    
    return { success: true, data: newOrder };
  },

  getUserOrders: async (userId: string): Promise<ApiResponse<Order[]>> => {
    await delay(600);
    const orders = JSON.parse(localStorage.getItem(DB_ORDERS) || '[]');
    const userOrders = orders
      .filter((o: Order) => o.userId === userId)
      .sort((a: Order, b: Order) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return { success: true, data: userOrders };
  },

  getAllOrders: async (): Promise<ApiResponse<Order[]>> => {
    await delay(600);
    const orders = JSON.parse(localStorage.getItem(DB_ORDERS) || '[]');
    return { success: true, data: orders };
  },

  updateStatus: async (orderId: string, status: Order['status']): Promise<ApiResponse<Order>> => {
    const orders = JSON.parse(localStorage.getItem(DB_ORDERS) || '[]');
    const index = orders.findIndex((o: Order) => o.id === orderId);
    if (index === -1) return { success: false, message: 'Order not found' };
    orders[index].status = status;
    localStorage.setItem(DB_ORDERS, JSON.stringify(orders));
    return { success: true, data: orders[index] };
  }
};
