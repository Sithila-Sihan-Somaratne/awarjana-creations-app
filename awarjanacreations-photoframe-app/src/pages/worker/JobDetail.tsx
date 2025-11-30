import WorkerLayout from "../../components/layout/WorkerLayout";
import OrderTracker from "../../components/shared/OrderTracker";

const JobDetail: React.FC = () => (
  <WorkerLayout>
    <h2>Job Detail</h2>
    <OrderTracker status="in_progress" />
    {/* ...job details/actions... */}
  </WorkerLayout>
);

export default JobDetail;