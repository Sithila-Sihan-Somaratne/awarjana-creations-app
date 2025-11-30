import AdminLayout from "../../components/layout/AdminLayout";
import OrderCard, { type Order } from "../../components/orders/OrderCard";

const mockOrders: Order[] = [
  { title: "Frame #1", customerName: "Nimal", status: "pending", totalPrice: 1000 },
  { title: "Frame #2", customerName: "Sunil", status: "confirmed", totalPrice: 2050 },
];

const OrdersAdmin: React.FC = () => (
  <AdminLayout>
    <h2>All Orders</h2>
    {mockOrders.map((o) => (
      <OrderCard order={o} key={o.title} />
    ))}
  </AdminLayout>
);

export default OrdersAdmin;