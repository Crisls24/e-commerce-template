export const STORE_DEFAULTS = {
  currency: "USD",
  taxRate: 0,
  name: "My Store",
  description: "An amazing online store",
} as const;

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export const PRODUCT_STATUSES = ["active", "draft", "archived"] as const;

export const PAYMENT_METHODS = [
  "card",
  "cash",
  "bank_transfer",
] as const;

export const ITEMS_PER_PAGE = 12;

export const POS_ITEMS_PER_PAGE = 24;
