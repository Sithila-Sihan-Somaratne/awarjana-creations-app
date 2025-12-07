// src/shared/OrderTracking.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";
import { Badge } from "../components/ui/badge";

interface Order {
  id: number;
  customer_id: string;
  worker_id: string | null;
  status: string;
  details: string; // JSON string of order details
  created_at: string;
  updated_at: string;
}

const statuses = ["Pending", "In Progress", "Completed"];

const OrderTracking = () => {
  const { userRole, userId } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    let query = supabase.from("orders").select("*");

    if (userRole === "customer") query = query.eq("customer_id", userId);
    else if (userRole === "worker") query = query.eq("worker_id", userId);

    const { data, error } = await query;
    if (error) console.error("Fetch orders error:", error);
    else setOrders(data || []);

    setLoading(false);
  };

  const updateStatus = async (orderId: number, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId);
    if (error) console.error("Update status error:", error);
    else fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, [userRole]);

  if (loading)
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    );

  if (!orders.length) return <p className="text-white">No orders available.</p>;

  return (
    <div className="bg-black p-4 rounded shadow-lg text-white my-4">
      <h2 className="text-yellow-400 text-2xl mb-4">Order Tracking</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Worker</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Details</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customer_id}</TableCell>
              <TableCell>{order.worker_id || "-"}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    order.status === "Completed"
                      ? "default"
                      : order.status === "Pending"
                      ? "secondary"
                      : "outline" // "In Progress"
                  }
                >
                  {order.status}
                </Badge>
              </TableCell>

              <TableCell>
                <pre className="whitespace-pre-wrap text-xs">
                  {order.details}
                </pre>
              </TableCell>
              <TableCell>
                {userRole === "worker" || userRole === "admin" ? (
                  <Select
                    defaultValue={order.status}
                    onValueChange={(value) => updateStatus(order.id, value)}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <span>View Only</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTracking;
