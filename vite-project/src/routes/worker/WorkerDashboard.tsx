import JobCard from "./JobCard";
import SubmitDraft from "./SubmitDraft";
import OrderTracking from "../../shared/OrderTracking";

const WorkerDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-yellow-400 text-3xl font-bold">
        Worker Dashboard
      </h1>

      <JobCard />
      <SubmitDraft />
      <OrderTracking />
    </div>
  );
};

export default WorkerDashboard;
