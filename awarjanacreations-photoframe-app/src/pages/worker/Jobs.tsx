import WorkerLayout from "../../components/layout/WorkerLayout";
import OrderCard, { type Order } from "../../components/orders/OrderCard";

const mockJobs: Order[] = [
  { title: "Job A", customerName: "Sithila", status: "in_progress", totalPrice: 1780 },
];

const Jobs: React.FC = () => (
  <WorkerLayout>
    <h2>Your Jobs</h2>
    {mockJobs.map((j) => (
      <OrderCard order={j} key={j.title} />
    ))}
  </WorkerLayout>
);

export default Jobs;