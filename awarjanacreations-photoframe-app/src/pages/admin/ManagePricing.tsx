import AdminLayout from "../../components/layout/AdminLayout";
import Calculator from "../../components/pricing/Calculator";

const ManagePricing: React.FC = () => (
  <AdminLayout>
    <h2>Manage Pricing Rules</h2>
    <Calculator basePrice={100} />
    {/* ...list/edit pricing rules, etc... */}
  </AdminLayout>
);

export default ManagePricing;