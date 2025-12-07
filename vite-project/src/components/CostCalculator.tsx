import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface Material {
  name: string;
  cost: number;
  quantity: number;
}

const baseMaterials: Material[] = [
  { name: "Frame", cost: 518.52, quantity: 0 },
  { name: "Glass", cost: 300, quantity: 0 },
  { name: "MDF", cost: 115, quantity: 0 },
  { name: "Wages", cost: 100, quantity: 0 },
  { name: "Electricity", cost: 50, quantity: 0 },
  { name: "Stand", cost: 50, quantity: 0 },
  { name: "Under Pin", cost: 20, quantity: 0 },
  { name: "Hook", cost: 10, quantity: 0 },
  { name: "Side Pin", cost: 10, quantity: 0 },
];

const CostCalculator = () => {
  const [materials, setMaterials] = useState<Material[]>(baseMaterials);
  const [total, setTotal] = useState(0);

  const calculateTotal = () => {
    const sum = materials.reduce((acc, m) => acc + m.cost * m.quantity, 0);
    setTotal(sum);
  };

  return (
    <div className="bg-black p-4 rounded shadow-lg text-white my-4">
      <h2 className="text-yellow-400 text-2xl mb-4">Cost Calculator</h2>
      {materials.map((m, idx) => (
        <div key={idx} className="flex items-center gap-4 mb-2">
          <span className="w-32">{m.name}:</span>
          <Input
            type="number"
            value={m.quantity}
            min={0}
            onChange={(e) => {
              const newQty = Number(e.target.value);
              const newMaterials = [...materials];
              newMaterials[idx].quantity = newQty;
              setMaterials(newMaterials);
            }}
          />
        </div>
      ))}
      <Button className="mt-4" onClick={calculateTotal}>
        Calculate
      </Button>
      <p className="mt-2 text-yellow-400">Total: {total.toFixed(2)}</p>
    </div>
  );
};

export default CostCalculator;
