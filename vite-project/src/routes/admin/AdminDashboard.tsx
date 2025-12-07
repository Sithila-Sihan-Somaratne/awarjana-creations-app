import AssignOrders from "./AssignOrders";
import DraftApproval from "./DraftApproval";
import MaterialsManagement from "./MaterialsManagement";
import PricingManagement from "./PricingManagement";
import OrderTracking from "../../shared/OrderTracking";

const AdminDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-yellow-400 text-3xl font-bold">
        Admin Dashboard
      </h1>

      <OrderTracking />
      <AssignOrders />
      <DraftApproval />
      <MaterialsManagement />
      <PricingManagement />
    </div>
  );
};

export default AdminDashboard;
