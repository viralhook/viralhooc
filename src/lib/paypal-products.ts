// PayPal product plan IDs
// Replace these with your actual PayPal plan/product IDs from the PayPal Developer Dashboard
export const PAYPAL_PRODUCTS = {
  // Monthly Pro subscription
  pro_monthly: {
    plan_id: "REPLACE_WITH_PAYPAL_MONTHLY_PLAN_ID",
    name: "Pro Monthly",
    price: 9.99,
    interval: "month",
    type: "subscription" as const,
  },
  // Annual Pro subscription (20% off)
  pro_annual: {
    plan_id: "REPLACE_WITH_PAYPAL_ANNUAL_PLAN_ID",
    name: "Pro Annual",
    price: 95.90,
    interval: "year",
    type: "subscription" as const,
  },
  // Credit packs (one-time via PayPal orders)
  credits_10: {
    name: "10 Credits",
    price: 9.99,
    credits: 10,
    type: "one_time" as const,
  },
  credits_50: {
    name: "50 Credits",
    price: 49.99,
    credits: 50,
    type: "one_time" as const,
  },
  credits_100: {
    name: "100 Credits",
    price: 79.99,
    credits: 100,
    type: "one_time" as const,
  },
  // Lifetime deal (one-time)
  lifetime: {
    name: "Lifetime Access",
    price: 199.99,
    type: "one_time" as const,
  },
} as const;

export type PayPalProductKey = keyof typeof PAYPAL_PRODUCTS;
