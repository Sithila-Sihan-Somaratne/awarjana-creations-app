import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

const Dashboard: React.FC = () => {
  const [orderCount, setOrderCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      const { data: orders } = await supabase.from("orders").select("status");

      if (!orders) return;

      setOrderCount(orders.length);
      setPendingCount(orders.filter((o) => o.status === "pending").length);
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="border p-4 rounded">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-bold">{orderCount}</p>
        </div>

        <div className="border p-4 rounded">
          <p className="text-sm text-muted-foreground">Pending Orders</p>
          <p className="text-2xl font-bold">{pendingCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
