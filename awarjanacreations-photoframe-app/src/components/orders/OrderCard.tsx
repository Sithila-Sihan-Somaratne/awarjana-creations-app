import OrderTracker from "../shared/OrderTracker";

export type Order = {
  title: string;
  customerName?: string;
  status: string;
  totalPrice: number;
};

const OrderCard: React.FC<{ order: Order }> = ({ order }) => (
  <div className="p-4 rounded bg-neutral-800 mb-3">
    <h3 className="font-bold">{order.title}</h3>
    <p>Customer: {order.customerName || "Unknown"}</p>
    <OrderTracker status={order.status} />
    <div className="text-right mt-2 font-bold">
      Total: Rs. {order.totalPrice}
    </div>
  </div>
);

export default OrderCard;
