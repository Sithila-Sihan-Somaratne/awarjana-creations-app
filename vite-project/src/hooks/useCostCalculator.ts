import { useState } from "react";

export interface ComponentCost {
  name: string;
  value: number;
}

export const useCostCalculator = () => {
  const [components, setComponents] = useState<ComponentCost[]>([
    { name: "Frame", value: 520 },
    { name: "Glass", value: 300 },
    { name: "MDF", value: 115 },
    { name: "Wages", value: 100 },
    { name: "Electricity", value: 50 },
    { name: "Stand", value: 50 },
    { name: "Under Pin", value: 20 },
    { name: "Hook", value: 10 },
    { name: "Side Pin", value: 10 },
    { name: "Coner L Bracket", value: 5 },
    { name: "Screw", value: 5 },
    { name: "Coner", value: 5 },
    { name: "Polythene", value: 5 },
  ]);

  const addComponent = (component: ComponentCost) => {
    setComponents([...components, component]);
  };

  const updateComponent = (name: string, value: number) => {
    setComponents(
      components.map((c) => (c.name === name ? { ...c, value } : c))
    );
  };

  const totalCost = components.reduce((sum, c) => sum + c.value, 0);

  return { components, addComponent, updateComponent, totalCost };
};
