import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";

const PlaceOrder = () => {
  const { userId } = useAuth();
  const [material, setMaterial] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setLoading(true);
    const { error } = await supabase.from("orders").insert([
      { customer_id: userId, details: { material, quantity }, status: "Pending", created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ]);

    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Success", description: "Order placed!" });

    setMaterial("");
    setQuantity(1);
    setLoading(false);
  };

  return (
    <div className="p-4 bg-black rounded shadow-lg text-white">
      <h2 className="text-yellow-400 text-2xl mb-4">Place Order</h2>
      <div className="flex flex-col gap-2">
        <Input placeholder="Material" value={material} onChange={(e) => setMaterial(e.target.value)} />
        <Input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Placing..." : "Place Order"}
        </Button>
      </div>
    </div>
  );
};

export default PlaceOrder;
