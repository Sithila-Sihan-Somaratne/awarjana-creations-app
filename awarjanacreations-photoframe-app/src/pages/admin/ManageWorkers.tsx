import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Worker = {
  id: string;
  full_name: string;
  email: string;
};

const ManageWorkers: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);

  useEffect(() => {
    const loadWorkers = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("role", "worker");

      setWorkers((data || []) as Worker[]);
    };

    loadWorkers();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Workers</h2>

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((w) => (
            <tr key={w.id} className="border-b">
              <td className="p-2">{w.full_name}</td>
              <td className="p-2">{w.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageWorkers;
