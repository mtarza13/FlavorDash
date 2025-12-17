
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  calories: number;
  prepTime: number; // in minutes
  ingredients: string[];
  isAvailable: boolean;
  reviews: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  token?: string; // Mock JWT
  favorites: string[]; // List of Product IDs
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  // Financials
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  
  date: string;
  status: 'pending' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
  
  // Payment & Delivery
  paymentMethod: 'card' | 'cash' | 'apple_pay';
  paymentStatus: 'pending' | 'paid' | 'failed';
  address: string;
  phone: string;
  instructions?: string;
  cardLast4?: string; // For receipt
}

export type ViewState = 
  | 'auth' 
  | 'home' 
  | 'details' 
  | 'cart' 
  | 'profile' 
  | 'admin' 
  | 'checkout' 
  | 'order-success'
  | 'admin-edit-product';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
