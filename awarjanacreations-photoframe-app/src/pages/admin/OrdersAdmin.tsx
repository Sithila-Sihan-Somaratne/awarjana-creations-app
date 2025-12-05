import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import OrderCard, { type Order } from "../../components/orders/OrderCard";

const OrdersAdmin: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select(`
          id,
          total_price,
          status,
          customer:profiles(full_name),
          product:products(title)
        `)
        .order("created_at", { ascending: false });

      if (!data) return;

      const mapped = data.map((o: any) => ({
        id: o.id,
        title: o.product?.title ?? "N/A",
        customerName: o.customer?.full_name ?? "N/A",
        status: o.status,
        totalPrice: o.total_price,
      }));

      setOrders(mapped);
    };

    loadOrders();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">All Orders</h2>

      {orders.map((o) => (
        <OrderCard order={o} key={o.id} />
      ))}
    </div>
  );
};

export default OrdersAdmin;
