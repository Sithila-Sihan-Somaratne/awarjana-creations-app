// src/components/pricing/Calculator.tsx
import React, { useState } from "react";
import { calculateClientPrice, type SizeOption } from "../../lib/pricing";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type Props = { basePrice?: number };

const sizeOptions: SizeOption[] = [
  { label: "Small", multiplier: 1 },
  { label: "Medium", multiplier: 1.25 },
  { label: "Large", multiplier: 1.5 },
];

const Calculator: React.FC<Props> = ({ basePrice = 150 }) => {
  const [size, setSize] = useState<SizeOption>(sizeOptions[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [urgency, setUrgency] = useState<"normal" | "urgent">("normal");
  const [discount, setDiscount] = useState<number>(0);

  const total = calculateClientPrice({
    size,
    quantity,
    urgency,
    basePrice,
    discount,
  });

  return (
    <div className="bg-neutral-900 p-4 rounded-lg">
      <h3 className="text-xl font-semibold text-yellow-300 mb-3">Price Calculator</h3>

      <div className="grid gap-3">
        <div>
          <label className="block text-sm mb-1">Size</label>
          <div className="flex gap-2">
            {sizeOptions.map((s) => (
              <button
                key={s.label}
                onClick={() => setSize(s)}
                className={`px-3 py-2 rounded-md text-sm ${
                  size.label === s.label ? "bg-yellow-400 text-black" : "bg-neutral-800 text-neutral-200"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Quantity</label>
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value || 1))}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Urgency</label>
          <div className="flex gap-2">
            <button
              onClick={() => setUrgency("normal")}
              className={`px-3 py-2 rounded-md ${urgency === "normal" ? "bg-neutral-700" : "bg-neutral-800"}`}
            >
              Normal
            </button>
            <button
              onClick={() => setUrgency("urgent")}
              className={`px-3 py-2 rounded-md ${urgency === "urgent" ? "bg-yellow-400 text-black" : "bg-neutral-800"}`}
            >
              Urgent
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Discount (optional)</label>
          <Input type="number" min={0} value={discount} onChange={(e) => setDiscount(Number(e.target.value || 0))} />
        </div>

        <div className="pt-3 flex items-center justify-between">
          <div className="text-lg font-bold">Total</div>
          <div className="text-2xl font-extrabold text-green-300">LKR {total}</div>
        </div>

        <div className="flex gap-2">
          <Button>Order Now</Button>
          <Button variant="outline">Save Quote</Button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
