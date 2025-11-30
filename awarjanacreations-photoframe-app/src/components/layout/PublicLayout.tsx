import Navbar from "../shared/Navbar";

type Props = {
  children: React.ReactNode;
};

const PublicLayout: React.FC<Props> = ({ children }) => (
  <div className="min-h-screen bg-black text-yellow-500">
    <Navbar />
    <main className="p-8">{children}</main>
  </div>
);

export default PublicLayout;