// Types shared by the storefront (src/) and the API server (server/).

export type Gender = 'men' | 'women' | 'unisex';

export type CategoryId = 'shirts' | 'dresses' | 'gowns' | 'sneakers' | 'heels' | 'bags' | 'sunglasses';

export interface Category {
  id: CategoryId;
  name: string;
}

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: CategoryId;
  gender: Gender;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  /** Empty means the product is one size. */
  sizes: string[];
  colors: ColorOption[];
  images: string[];
  description: string;
  details: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  createdAt: string;
}

export interface CartItem {
  key: string;
  productId: number;
  slug: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice?: number;
  size?: string;
  color: string;
  quantity: number;
  maxQuantity: number;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  savings: number;
  shipping: number;
  tax: number;
  total: number;
}

export type Role = 'customer' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export type PaymentMethod = 'card' | 'upi' | 'cod';

export type OrderStatus = 'pending' | 'delivered';

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  deliveredAt: string | null;
  userId: number | null;
  userEmail: string;
  items: CartItem[];
  shipping: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentLabel: string;
  totals: CartTotals;
}

export interface AdminStats {
  revenue: number;
  orders: number;
  pendingOrders: number;
  products: number;
  lowStockProducts: number;
}
