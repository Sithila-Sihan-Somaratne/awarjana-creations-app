import OrderTracker from "../shared/OrderTracker";

export type Order = {
  title: string;
  customerName?: string;
  status: string;
  totalPrice: number;
};

type Props = {
  order: Order;
};

const OrderCard: React.FC<Props> = ({ order }) => (
  <div className="p-4 rounded-lg shadow-md bg-neutral-800 mb-3">
    <h3 className="font-bold text-lg">{order.title}</h3>
    <p>Customer: {order.customerName || "Unknown"}</p>
    <OrderTracker status={order.status} />
    <div className="text-right text-sm text-green-200">
      Total: රු. {order.totalPrice}
    </div>
  </div>
);

export default OrderCard;