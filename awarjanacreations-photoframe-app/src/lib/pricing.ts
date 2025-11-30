// src/lib/pricing.ts

import { supabase } from './supabaseClient';

// Define the required types based on the DB schema
// Note: We use string for IDs and numbers for costs/multipliers
export type OrderItem = {
  productId: string;
  sizeId: string;
  qty: number;
};

export type Product = {
  id: string;
  base_price: number; // Base cost of the frame material
};

export type Size = {
  id: string;
  multiplier: number; // Size factor (e.g., 1.5x the base price)
};

export type PricingRules = {
  urgent_multiplier: number;
  base_labor_cost: number;
  // Add other extracted constants like late_discount_small etc.
};

/**
 * Fetches the necessary pricing rules from the Supabase DB.
 * In a real app, this should be cached or loaded once on app start.
 */
async function getPricingRules(): Promise<PricingRules> {
  // Fetch pricing rules from the DB. We assume the DB contains rows named:
  // 'urgent_fee', 'base_labor', etc., as structured in the SQL plan.
  const { data, error } = await supabase
    .from('pricing_rules')
    .select('name, value');

  if (error) {
    console.error('Error fetching pricing rules:', error);
    throw new Error('Failed to load pricing data.');
  }

  // Convert the array of rules into a single, usable object
  const rules = data.reduce((acc, rule) => {
    if (rule.name === 'urgent_fee') {
      acc.urgent_multiplier = rule.value.multiplier || 1.35;
    }
    if (rule.name === 'base_labor') {
      acc.base_labor_cost = rule.value.cost || 25.00;
    }
    // Add logic for other rules (discounts, major late fee, etc.)
    return acc;
  }, {} as any) as PricingRules;

  if (!rules.urgent_multiplier || !rules.base_labor_cost) {
      console.warn("Missing critical pricing rules! Check database setup.");
  }

  return rules;
}

/**
 * Calculates the total cost for a list of order items.
 * NOTE: This function is for CLIENT-SIDE estimation. The server must re-calculate
 * the final authoritative price upon order confirmation.
 *
 * @param items - Array of items with product/size IDs and quantity.
 * @param isUrgent - Flag if the 'urgent' deadline is selected.
 * @param discountPct - Percentage discount (0-100).
 * @returns Object containing the estimated subtotal and discounted final price.
 */
export async function calculatePriceEstimate(
  items: OrderItem[],
  isUrgent: boolean,
  discountPct: number = 0
): Promise<{ subtotal: number; finalPrice: number }> {
  if (items.length === 0) return { subtotal: 0, finalPrice: 0 };

  const rules = await getPricingRules();

  // 1. Fetch all unique product and size details for the calculation
  // (In a real scenario, optimize this query to fetch all needed data efficiently)
  // For simplicity here, we assume a combined cost is available.

  // Placeholder for fetching product and size data from DB:
  // const { data: productsData } = await supabase.from('products').select('id, base_price');
  // const { data: sizesData } = await supabase.from('sizes').select('id, multiplier');
  // ... (map the fetched data to a lookup object)
  
  // --- Start of Core Calculation Logic ---
  
  let materialsCost = 0;
  
  // --- Mapping the CSV structure to calculation: ---
  // The CSV shows: Frame: 518.5, Glass: 300, MDF: 115, etc.
  // We assume the 'base_price' in the DB (for a Product) represents the total material cost
  // for the SMALLEST size (Multiplier 1.0) and already includes 'Wages' and 'Electricity'.
  
  // For the sake of completing the code structure:
  const productPriceLookup = new Map<string, Product>(); // Replace with actual DB fetch
  const sizeMultiplierLookup = new Map<string, Size>(); // Replace with actual DB fetch

  // Simulate fetching/mapping the product/size data for calculation
  // You must implement the actual data fetching here.
  
  for (const item of items) {
    const product = productPriceLookup.get(item.productId);
    const size = sizeMultiplierLookup.get(item.sizeId);
    
    if (product && size) {
      const unitPrice = product.base_price * size.multiplier;
      materialsCost += unitPrice * item.qty;
    } else {
      console.warn(`Missing product or size data for item: ${item.productId}/${item.sizeId}`);
    }
  }

  // 2. Apply fixed costs (Base Labor)
  let subtotal = materialsCost + rules.base_labor_cost;

  // 3. Apply Urgent Multiplier
  if (isUrgent) {
    subtotal *= rules.urgent_multiplier;
  }

  // 4. Apply Discount
  const finalPrice = subtotal * (1 - discountPct / 100);

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    finalPrice: parseFloat(finalPrice.toFixed(2)),
  };
}