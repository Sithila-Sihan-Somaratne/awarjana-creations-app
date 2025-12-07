import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  ClipboardList,
  Shield,
} from "lucide-react";

const Sidebar = () => {
  const { userRole } = useAuth();
  const location = useLocation();

  const baseClass =
    "w-64 bg-neutral-950 border-r border-yellow-500 p-4 flex flex-col gap-2";

  const active = (path: string) =>
    location.pathname === path ? "secondary" : "outline";

  return (
    <aside className={baseClass}>
      <div className="text-yellow-400 font-semibold mb-4">
        Navigation
      </div>

      {userRole === "customer" && (
        <>
          <Link to="/customer">
            <Button variant={active("/customer")} className="w-full justify-start">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          <Link to="/customer/place-order">
            <Button variant={active("/customer/place-order")} className="w-full justify-start">
              <ClipboardList className="mr-2 h-4 w-4" />
              Place Order
            </Button>
          </Link>
        </>
      )}

      {userRole === "worker" && (
        <Link to="/worker">
          <Button variant={active("/worker")} className="w-full justify-start">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Worker Panel
          </Button>
        </Link>
      )}

      {userRole === "admin" && (
        <>
          <Link to="/admin">
            <Button variant={active("/admin")} className="w-full justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Button>
          </Link>

          <Link to="/admin/pricing">
            <Button variant={active("/admin/pricing")} className="w-full justify-start">
              Manage Pricing
            </Button>
          </Link>

          <Link to="/admin/materials">
            <Button variant={active("/admin/materials")} className="w-full justify-start">
              Manage Materials
            </Button>
          </Link>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
