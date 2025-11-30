import PublicLayout from "../components/layout/PublicLayout";
import Calculator from "../components/pricing/Calculator";

const Pricing: React.FC = () => (
  <PublicLayout>
    <h2>Pricing</h2>
    <Calculator basePrice={150} />
    {/* ...info about products, etc... */}
  </PublicLayout>
);

export default Pricing;