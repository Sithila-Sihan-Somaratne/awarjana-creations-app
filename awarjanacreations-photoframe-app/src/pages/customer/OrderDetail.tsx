import CustomerLayout from "../../components/layout/CustomerLayout";
import OrderTracker from "../../components/shared/OrderTracker";

const OrderDetail: React.FC = () => (
  <CustomerLayout>
    <h2 className="text-2xl font-bold mb-4">Order Detail</h2>
    <OrderTracker status="confirmed" />
  </CustomerLayout>
);

export default OrderDetail;
