import OrderTracking from "../../shared/OrderTracking";
import PlaceOrder from "./PlaceOrder";
import CostCalculator from "../../components/CostCalculator";

const CustomerDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-yellow-400 text-3xl font-bold">
        Customer Dashboard
      </h1>

      <PlaceOrder />
      <CostCalculator />
      <OrderTracking />
    </div>
  );
};

export default CustomerDashboard;
