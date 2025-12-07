import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const OrderForm = () => {
  const [material, setMaterial] = useState("");

  const submitOrder = async () => {
    await supabase.from("orders").insert([{ details: { material } }]);
  };

  return (
    <div>
      <input onChange={(e) => setMaterial(e.target.value)} />
      <button onClick={submitOrder}>Submit</button>
    </div>
  );
};

export default OrderForm;
