export type UserRole = "owner" | "admin" | "staff" | "customer";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface StoreSettings {
  currency: string;
  taxRate: number;
  shippingRates: ShippingRate[];
  businessHours: BusinessHours;
}

export interface ShippingRate {
  id: string;
  name: string;
  price: number;
  minOrderAmount?: number;
}

export interface BusinessHours {
  [key: string]: { open: string; close: string; closed: boolean };
}

export interface ProductImage {
  url: string;
  alt: string;
  order: number;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface POSItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}
