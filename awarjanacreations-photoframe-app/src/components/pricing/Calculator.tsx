import { useState } from "react";
import { calculateClientPrice, type SizeOption } from "../../lib/pricing";

type Props = {
  basePrice?: number;
};

const Calculator: React.FC<Props> = ({ basePrice = 100 }) => {
  const [size, setSize] = useState<SizeOption>({ label: "S", multiplier: 1 });
  const [quantity, setQuantity] = useState(1);
  const [urgency, setUrgency] = useState<"normal" | "urgent">("normal");
  const [discount, setDiscount] = useState(0);

  const price = calculateClientPrice({ size, quantity, urgency, basePrice, discount });

  return (
    <div className="p-4 rounded bg-neutral-700">
      <h4 className="font-bold mb-2 text-yellow-200">Price Calculator</h4>
      <div className="mb-2">
        Size:
        <select
          value={size.label}
          onChange={(e) =>
            setSize({ label: e.target.value, multiplier: e.target.value === "L" ? 1.5 : 1 })
          }
        >
          <option value="S">Small</option>
          <option value="L">Large</option>
        </select>
      </div>
      <div className="mb-2">
        Quantity:
        <input
          type="number"
          value={quantity}
          min={1}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>
      <div className="mb-2">
        Urgency:
        <select value={urgency} onChange={(e) => setUrgency(e.target.value as "normal" | "urgent")}>
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
      <div>
        Discount:
        <input
          type="number"
          value={discount}
          min={0}
          onChange={(e) => setDiscount(Number(e.target.value))}
        />
      </div>
      <div className="mt-3 font-bold text-green-300">
        Total Price: රු. / ரூ / LKR {price}
      </div>
    </div>
  );
};

export default Calculator;