import Navbar from "../shared/Navbar";

type Props = {
  children: React.ReactNode;
};

const WorkerLayout: React.FC<Props> = ({ children }) => (
  <div className="min-h-screen bg-neutral-900 text-yellow-300">
    <Navbar />
    <main className="p-8">{children}</main>
  </div>
);

export default WorkerLayout;