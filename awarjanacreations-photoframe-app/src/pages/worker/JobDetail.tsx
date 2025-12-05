import WorkerLayout from "../../components/layout/WorkerLayout";
import OrderTracker from "../../components/shared/OrderTracker";

const JobDetail: React.FC = () => (
  <WorkerLayout>
    <h2 className="text-2xl font-bold mb-4">Job Detail</h2>
    <OrderTracker status="in_progress" />
  </WorkerLayout>
);

export default JobDetail;
