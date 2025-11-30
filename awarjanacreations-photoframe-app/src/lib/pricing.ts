// src/lib/pricing.ts

/* ---------------------------------------------
   TYPES
--------------------------------------------- */
export type PricingConfig = {
  reference: {
    width_cm: number;
    height_cm: number;
    area_m2: number;
  };
  materials: {
    frame: number;
    glass: number;
    mdf: number;
    stand?: number;
    hook?: number;
    under_pin?: number;
    side_pin?: number;
    [k: string]: number | undefined;
  };
  overheads: {
    wages: number;
    electricity: number;
    [k: string]: number | undefined;
  };
  meta?: {
    total_reference_cost?: number;
    notes?: string;
  };
  business?: {
    profitMarginPct?: number;
    urgentMultiplier?: number;
    smallOrderSurcharge?: number;
  };
};

/* ---------------------------------------------
   DEFAULT CONFIG (ROUNDED VALUES)
--------------------------------------------- */
export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  reference: {
    width_cm: 48,
    height_cm: 96,
    area_m2: 0.48 * 0.96 // 0.4608
  },

  materials: {
    frame: 518.0, // ✅ rounded from 518.518...
    glass: 300.0,
    mdf: 115.0,
    stand: 50.0,
    hook: 10.0,
    under_pin: 20.0,
    side_pin: 10.0
  },

  overheads: {
    wages: 100.0,
    electricity: 50.0
  },

  meta: {
    total_reference_cost: 1173.0,
    notes: "Imported from cost.xlsx (rounded reference values)."
  },

  business: {
    profitMarginPct: 0.3,   // 30%
    urgentMultiplier: 1.25, // 25% urgent extra
    smallOrderSurcharge: 0
  }
};

/* ---------------------------------------------
   HELPER: SCALE COST BY AREA
--------------------------------------------- */
export function scaleMaterialCost(
  referenceArea: number,
  actualArea: number,
  baseCost: number
): number {
  if (!referenceArea || !actualArea) return 0;
  const ratio = actualArea / referenceArea;
  return Number((baseCost * ratio).toFixed(2));
}

/* ---------------------------------------------
   HELPER: FINAL PRICE CALCULATION (CLIENT SIDE)
--------------------------------------------- */
export function calculateClientPrice(
  config: PricingConfig,
  width_cm: number,
  height_cm: number,
  quantity: number,
  isUrgent: boolean = false
) {
  const area_m2 = (width_cm / 100) * (height_cm / 100);
  const referenceArea = config.reference.area_m2;

  // 1. Scale materials
  let materialTotal = 0;

  for (const key in config.materials) {
    const baseCost = config.materials[key] ?? 0;
    materialTotal += scaleMaterialCost(
      referenceArea,
      area_m2,
      baseCost
    );
  }

  // 2. Add overheads
  const overheadTotal =
    (config.overheads.wages ?? 0) +
    (config.overheads.electricity ?? 0);

  // 3. Base cost × quantity
  let subtotal =
    (materialTotal + overheadTotal) * quantity;

  // 4. Profit margin
  if (config.business?.profitMarginPct) {
    subtotal +=
      subtotal * config.business.profitMarginPct;
  }

  // 5. Urgent multiplier
  if (isUrgent && config.business?.urgentMultiplier) {
    subtotal *= config.business.urgentMultiplier;
  }

  return Number(subtotal.toFixed(2));
}
