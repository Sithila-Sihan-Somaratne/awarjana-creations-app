import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";

interface PriceItem { id: number; name: string; cost: number; }

const PricingManagement = () => {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [newName, setNewName] = useState("");
  const [newCost, setNewCost] = useState<number>(0);
  const { toast } = useToast();

  const fetchPrices = async () => {
    const { data, error } = await supabase.from("pricing").select("*").order("id");
    if (!error && data) setPrices(data);
  };

  const addPrice = async () => {
    const { error } = await supabase.from("pricing").insert([{ name: newName, cost: newCost }]);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Success", description: "Price added!" });
    setNewName(""); setNewCost(0); fetchPrices();
  };

  const updatePrice = async (id: number, cost: number) => {
    const { error } = await supabase.from("pricing").update({ cost }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Updated", description: "Price updated" });
    fetchPrices();
  };

  const deletePrice = async (id: number) => {
    await supabase.from("pricing").delete().eq("id", id);
    fetchPrices();
  };

  useEffect(() => { fetchPrices(); }, []);

  return (
    <div className="p-4 bg-black text-white rounded shadow">
      <h2 className="text-yellow-400 text-xl mb-4">Pricing Management</h2>

      {/* ADD NEW ITEM */}
      <div className="flex gap-2 mb-6">
        <Input placeholder="Component Name" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <Input type="number" placeholder="Cost" value={newCost} onChange={(e) => setNewCost(Number(e.target.value))} />
        <Button onClick={addPrice}>Add</Button>
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {prices.map((p) => (
          <div key={p.id} className="flex items-center justify-between bg-neutral-900 p-2 rounded">
            <span>{p.name}</span>
            <Input type="number" defaultValue={p.cost} className="w-32" onBlur={(e) => updatePrice(p.id, Number(e.target.value))} />
            <Button variant="destructive" onClick={() => deletePrice(p.id)}>Delete</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingManagement;
