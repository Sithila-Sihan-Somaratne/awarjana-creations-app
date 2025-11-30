import Navbar from "../shared/Navbar";

type Props = {
  children: React.ReactNode;
};

const CustomerLayout: React.FC<Props> = ({ children }) => (
  <div className="min-h-screen bg-zinc-950 text-yellow-100">
    <Navbar />
    <main className="p-8">{children}</main>
  </div>
);

export default CustomerLayout;