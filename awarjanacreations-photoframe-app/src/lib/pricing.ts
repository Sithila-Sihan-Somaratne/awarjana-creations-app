// src/lib/pricing.ts

/* -----------------------------
   TYPES
-------------------------------- */

export type SizeOption = {
  label: string;
  multiplier: number;
};

export type PricingConfig = {
  reference: {
    width_cm: number;
    height_cm: number;
  };
  business: {
    profitMarginPct: number;   // 0.25 = 25%
    urgentMultiplier: number; // e.g. 1.5
  };
  overheads: {
    wages: number;
    electricity: number;
  };
  materials: Record<string, number>;
};

/* -----------------------------
   DEFAULT CONFIG (518.0 FIXED ✅)
-------------------------------- */

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  reference: {
    width_cm: 30,
    height_cm: 20,
  },
  business: {
    profitMarginPct: 0.25,     // 25%
    urgentMultiplier: 1.5,
  },
  overheads: {
    wages: 518.0,             // ✅ FIXED FROM 518.518 → 518.0
    electricity: 120,
  },
  materials: {
    wood: 350,
    glass: 240,
    print: 180,
  },
};

/* -----------------------------
   SERVER / ADMIN PRICE CALC
   (Used by OrderCreate.tsx)
-------------------------------- */

export function calculatePrice(
  config: PricingConfig,
  widthCm: number,
  heightCm: number,
  quantity: number,
  isUrgent: boolean
): number {
  const areaFactor =
    (widthCm * heightCm) /
    (config.reference.width_cm * config.reference.height_cm);

  // Base material cost
  const materialCost =
    Object.values(config.materials).reduce((a, b) => a + b, 0) * areaFactor;

  // Overheads
  const overheadCost =
    (config.overheads.wages + config.overheads.electricity) * areaFactor;

  // Raw cost
  let cost = (materialCost + overheadCost) * quantity;

  // Profit
  cost = cost * (1 + config.business.profitMarginPct);

  // Urgency
  if (isUrgent) {
    cost = cost * config.business.urgentMultiplier;
  }

  return Math.round(cost);
}

/* -----------------------------
   CLIENT‑SIDE SIMPLE CALCULATOR
   (Used by Calculator.tsx)
-------------------------------- */

export function calculateClientPrice({
  size,
  quantity,
  urgency,
  basePrice,
  discount = 0,
}: {
  size: SizeOption;
  quantity: number;
  urgency: "normal" | "urgent";
  basePrice: number;
  discount?: number;
}): number {
  let price = basePrice * size.multiplier * quantity;

  if (urgency === "urgent") {
    price = price * 1.25;
  }

  if (discount > 0) {
    price = price - discount;
  }

  return Math.round(price);
}
