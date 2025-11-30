// src/router/AppRouter.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* Auth pages */
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import InviteCodeRegister from "../pages/auth/InviteCodeRegister";
import ForgotPassword from "../pages/auth/ForgotPassword";

/* Admin pages */
import Dashboard from "../pages/admin/Dashboard";
import ManageWorkers from "../pages/admin/ManageWorkers";
import ManagePricing from "../pages/admin/ManagePricing";
import OrdersAdmin from "../pages/admin/OrdersAdmin";

/* Worker pages */
import Jobs from "../pages/worker/Jobs";
import JobDetail from "../pages/worker/JobDetail";

/* Customer pages */
import OrderCreate from "../pages/customer/OrderCreate";
import OrderDetail from "../pages/customer/OrderDetail";

/* Public pages */
import Home from "../public/Home";
import Pricing from "../public/Pricing";

/* Layouts */
import AdminLayout from "../components/layout/AdminLayout";
import WorkerLayout from "../components/layout/WorkerLayout";
import CustomerLayout from "../components/layout/CustomerLayout";
import PublicLayout from "../components/layout/PublicLayout";

/* Guards */
import ProtectedRoute from "./ProtectedRouter";

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="pricing" element={<Pricing />} />
        </Route>

        {/* Auth */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/register" element={<InviteCodeRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin area - only admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/orders" element={<OrdersAdmin />} />
            <Route path="/admin/workers" element={<ManageWorkers />} />
            <Route path="/admin/pricing" element={<ManagePricing />} />
          </Route>
        </Route>

        {/* Worker area - only worker */}
        <Route element={<ProtectedRoute allowedRoles={["worker"]} />}>
          <Route element={<WorkerLayout />}>
            <Route path="/worker/jobs" element={<Jobs />} />
            <Route path="/worker/jobs/:id" element={<JobDetail />} />
          </Route>
        </Route>

        {/* Customer area - only customer */}
        <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
          <Route element={<CustomerLayout />}>
            <Route path="/customer/order/new" element={<OrderCreate />} />
            <Route path="/customer/orders/:id" element={<OrderDetail />} />
          </Route>
        </Route>

        {/* fallback - go to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
