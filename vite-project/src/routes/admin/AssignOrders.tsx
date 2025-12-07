import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Select, SelectContent, SelectItem } from "../../components/ui/select";
import { Button } from "../../components/ui/button";

interface Order {
  id: number;
  customer_id: string;
  status: string;
}

interface Worker {
  id: string;
  email: string;
}

const AssignOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<string>("");

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").eq("status", "Pending");
    setOrders(data || []);
  };

  const fetchWorkers = async () => {
    const { data } = await supabase.from("users").select("*").eq("role", "worker");
    setWorkers(data || []);
  };

  useEffect(() => {
    fetchOrders();
    fetchWorkers();
  }, []);

  const assign = async (orderId: number) => {
    if (!selectedWorker) return;
    await supabase.from("orders").update({ worker_id: selectedWorker, status: "In Progress" }).eq("id", orderId);
    fetchOrders();
  };

  return (
    <div className="p-4 bg-black rounded shadow-lg text-white">
      <h2 className="text-yellow-400 text-2xl mb-4">Assign Orders</h2>
      <Select onValueChange={(value) => setSelectedWorker(value)}>
        <SelectContent>
          {workers.map((w) => (
            <SelectItem key={w.id} value={w.id}>{w.email}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="mt-4 space-y-2">
        {orders.map((order) => (
          <div key={order.id} className="flex justify-between items-center">
            <span>Order #{order.id} - Customer: {order.customer_id}</span>
            <Button onClick={() => assign(order.id)}>Assign</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignOrders;
