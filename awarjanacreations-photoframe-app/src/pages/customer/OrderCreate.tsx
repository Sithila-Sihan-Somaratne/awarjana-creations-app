import CustomerLayout from "../../components/layout/CustomerLayout";
import Calculator from "../../components/pricing/Calculator";

const OrderCreate: React.FC = () => (
  <CustomerLayout>
    <h2>Create New Order</h2>
    <Calculator basePrice={200} />
    {/* ...order form fields, submit... */}
  </CustomerLayout>
);

export default OrderCreate;