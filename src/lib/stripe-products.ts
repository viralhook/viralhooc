// Stripe product and price IDs
export const STRIPE_PRODUCTS = {
  // Monthly Pro subscription
  pro_monthly: {
    product_id: "prod_Tr8OslDlLYMCy3",
    price_id: "price_1StQ7MPopGBLA9dD2z5Xwj9X",
    name: "Pro Monthly",
    price: 9.99,
    interval: "month",
  },
  // Annual Pro subscription (20% off)
  pro_annual: {
    product_id: "prod_TsGeYGoDcq8ib4",
    price_id: "price_1SuW6rPopGBLA9dDLwo8rIi0",
    name: "Pro Annual",
    price: 95.90,
    interval: "year",
  },
  // Credit packs (one-time)
  credits_10: {
    product_id: "prod_TsGeSr1sm5rmlY",
    price_id: "price_1SuW78PopGBLA9dDhcQXZn7i",
    name: "10 Credits",
    price: 9.99,
    credits: 10,
  },
  credits_50: {
    product_id: "prod_TsGeTHcwEOC7jE",
    price_id: "price_1SuW7VPopGBLA9dDBdNKr6KR",
    name: "50 Credits",
    price: 49.99,
    credits: 50,
  },
  credits_100: {
    product_id: "prod_TsGf6IzHyu6t07",
    price_id: "price_1SuW7rPopGBLA9dDqjTq0f86",
    name: "100 Credits",
    price: 79.99,
    credits: 100,
  },
  // Lifetime deal (one-time)
  lifetime: {
    product_id: "prod_TsGfjmALT7mrBR",
    price_id: "price_1SuW85PopGBLA9dDXtwaQxha",
    name: "Lifetime Access",
    price: 199.99,
  },
} as const;

export type ProductKey = keyof typeof STRIPE_PRODUCTS;
