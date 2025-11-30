// src/lib/pricing.ts

export type SizeOption = {
  label: string
  multiplier: number
};

export type CalculatePriceArgs = {
  size: SizeOption
  quantity: number
  urgency: "normal" | "urgent"
  basePrice: number
  discount?: number
};

export function calculatePrice({
  size,
  quantity,
  urgency,
  basePrice,
  discount = 0
}: CalculatePriceArgs): number {
  let price = basePrice * quantity;
  if (urgency === "urgent") price *= 1.2;
  price *= size?.multiplier ?? 1;
  price -= discount;
  return Math.max(price, 0);
}