import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import InviteCodeRegister from "../pages/auth/InviteCodeRegister";
import ForgotPassword from "../pages/auth/ForgotPassword";

import Dashboard from "../pages/admin/Dashboard";
import ManageWorkers from "../pages/admin/ManageWorkers";
import ManagePricing from "../pages/admin/ManagePricing";
import OrdersAdmin from "../pages/admin/OrdersAdmin";

import Jobs from "../pages/worker/Jobs";
import JobDetail from "../pages/worker/JobDetail";

import OrderCreate from "../pages/customer/OrderCreate";
import OrderDetail from "../pages/customer/OrderDetail";

import Home from "../public/Home";
import Pricing from "../public/Pricing";

import ProtectedRoute from "./ProtectedRouter";

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/invite" element={<InviteCodeRegister />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Admin */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/workers" element={<ManageWorkers />} />
          <Route path="/admin/pricing" element={<ManagePricing />} />
          <Route path="/admin/orders" element={<OrdersAdmin />} />
        </Route>

        {/* Worker */}
        <Route element={<ProtectedRoute role="worker" />}>
          <Route path="/worker/jobs" element={<Jobs />} />
          <Route path="/worker/jobs/:id" element={<JobDetail />} />
        </Route>

        {/* Customer */}
        <Route element={<ProtectedRoute role="customer" />}>
          <Route path="/customer/order/new" element={<OrderCreate />} />
          <Route path="/customer/orders/:id" element={<OrderDetail />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;