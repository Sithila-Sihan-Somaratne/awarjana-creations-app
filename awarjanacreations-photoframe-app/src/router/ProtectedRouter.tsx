import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

type Props = {
  role: string;
};

const ProtectedRoute: React.FC<Props> = ({ role }) => {
  const { session, user } = useAuth();
  // Replace with actual role fetching logic from user profile
  const userRole = session?.user?.role || "public";

  if (!user) return <Navigate to="/signin" />;
  if (role && userRole !== role) return <Navigate to="/" />;

  return <Outlet />;
};

export default ProtectedRoute;