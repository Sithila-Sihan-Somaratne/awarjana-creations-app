import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

interface Material {
  id: number;
  name: string;
  quantity: number;
}

const MaterialsManagement = () => {
  const [materials, setMaterials] = useState<Material[]>([]);

  const fetchMaterials = async () => {
    const { data } = await supabase.from("materials").select("*");
    setMaterials(data || []);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const updateQuantity = async (id: number, qty: number) => {
    await supabase.from("materials").update({ quantity: qty }).eq("id", id);
    fetchMaterials();
  };

  return (
    <div className="p-4 bg-black rounded shadow-lg text-white">
      <h2 className="text-yellow-400 text-2xl mb-4">Materials Management</h2>
      {materials.map((m) => (
        <div key={m.id} className="flex items-center gap-2 mb-2">
          <span className="w-32">{m.name}</span>
          <Input
            type="number"
            value={m.quantity}
            onChange={(e) => updateQuantity(m.id, Number(e.target.value))}
          />
          <Button onClick={() => updateQuantity(m.id, m.quantity)}>Update</Button>
        </div>
      ))}
    </div>
  );
};

export default MaterialsManagement;
