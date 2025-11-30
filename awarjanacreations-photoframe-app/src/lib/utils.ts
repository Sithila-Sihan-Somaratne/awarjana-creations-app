// src/lib/utils.ts

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines Tailwind CSS classes and resolves conflicts.
 * Essential for using Shadcn/ui components effectively.
 * @param inputs - Array of class values (strings, arrays, or objects).
 * @returns A merged, cleaned string of classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency (Euro for context).
 * @param amount - The number to format.
 * @returns A formatted currency string (e.g., "€1,234.56").
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'රු.', 
  }).format(amount);
}

// Additional helper for date formatting can be added here as needed.