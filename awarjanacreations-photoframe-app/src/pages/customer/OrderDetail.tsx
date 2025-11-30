import CustomerLayout from "../../components/layout/CustomerLayout";
import OrderTracker from "../../components/shared/OrderTracker";

const OrderDetail: React.FC = () => (
  <CustomerLayout>
    <h2>Order Detail</h2>
    <OrderTracker status="confirmed" />
    {/* ...order info, payment, etc... */}
  </CustomerLayout>
);

export default OrderDetail;