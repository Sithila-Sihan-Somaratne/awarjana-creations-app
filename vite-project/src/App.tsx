import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Sidebar from "./components/layout/Sidebar";

import CustomerDashboard from "./routes/customer/CustomerDashboard";
import PlaceOrder from "./routes/customer/PlaceOrder";

import WorkerDashboard from "./routes/worker/WorkerDashboard";
import SubmitDraft from "./routes/worker/SubmitDraft";

import AdminDashboard from "./routes/admin/AdminDashboard";
import AssignOrders from "./routes/admin/AssignOrders";
import DraftApproval from "./routes/admin/DraftApproval";
import MaterialsManagement from "./routes/admin/MaterialsManagement";
import PricingManagement from "./routes/admin/PricingManagement";

import SignIn from "./routes/auth/SignIn";
import SignUp from "./routes/auth/SignUp";

const AppRoutes = () => {
  const { userId, userRole, loading } = useAuth();

  // ✅ Still checking session
  if (loading) {
    return <p className="text-white p-6">Checking session...</p>;
  }

  // ✅ NOT logged in
  if (!userId) {
    return (
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    );
  }

  // ✅ Logged in but role not loaded
  if (!userRole) {
    return <p className="text-white p-6">Loading user role...</p>;
  }

  // ✅ Fully authenticated
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <div className="flex-1 p-6 overflow-auto">
          <Routes>

            {/* CUSTOMER */}
            {userRole === "customer" && (
              <>
                <Route path="/customer" element={<CustomerDashboard />} />
                <Route path="/customer/place-order" element={<PlaceOrder />} />
              </>
            )}

            {/* WORKER */}
            {userRole === "worker" && (
              <>
                <Route path="/worker" element={<WorkerDashboard />} />
                <Route path="/worker/submit-draft" element={<SubmitDraft />} />
              </>
            )}

            {/* ADMIN */}
            {userRole === "admin" && (
              <>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/assign-orders" element={<AssignOrders />} />
                <Route path="/admin/draft-approval" element={<DraftApproval />} />
                <Route path="/admin/materials" element={<MaterialsManagement />} />
                <Route path="/admin/pricing" element={<PricingManagement />} />
              </>
            )}

            {/* ✅ Default redirect after login */}
            <Route path="*" element={<Navigate to={`/${userRole}`} replace />} />

          </Routes>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
