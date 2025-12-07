import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui/table";

interface Order {
  id: number;
  details: any;
  status: string;
  customer_id: string;
}

const JobCard = () => {
  const { userId } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchJobs = async () => {
    const { data } = await supabase.from("orders").select("*").eq("worker_id", userId);
    setOrders(data || []);
  };

  useEffect(() => {
    fetchJobs();
  }, [userId]);

  return (
    <div className="p-4 bg-black rounded shadow-lg text-white">
      <h2 className="text-yellow-400 text-2xl mb-4">My Job Cards</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{JSON.stringify(order.details)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default JobCard;
