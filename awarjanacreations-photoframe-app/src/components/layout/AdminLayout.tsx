import Navbar from "../shared/Navbar";

type Props = {
  children: React.ReactNode;
};

const AdminLayout: React.FC<Props> = ({ children }) => (
  <div className="min-h-screen bg-neutral-900 text-yellow-200">
    <Navbar />
    <main className="p-8">{children}</main>
  </div>
);

export default AdminLayout;