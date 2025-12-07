import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Button } from "../../components/ui/button";

interface Draft {
  id: number;
  order_id: number;
  worker_id: string;
  draft_link: string;
  created_at: string;
}

const DraftApproval = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);

  const fetchDrafts = async () => {
    const { data } = await supabase.from("drafts").select("*");
    setDrafts(data || []);
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const approveDraft = async (draft: Draft) => {
    await supabase.from("orders").update({ status: "Completed" }).eq("id", draft.order_id);
    await supabase.from("drafts").delete().eq("id", draft.id);
    fetchDrafts();
  };

  const rejectDraft = async (draft: Draft) => {
    await supabase.from("orders").update({ status: "Pending" }).eq("id", draft.order_id);
    await supabase.from("drafts").delete().eq("id", draft.id);
    fetchDrafts();
  };

  return (
    <div className="p-4 bg-black rounded shadow-lg text-white">
      <h2 className="text-yellow-400 text-2xl mb-4">Draft Approval</h2>
      {drafts.map((d) => (
        <div key={d.id} className="flex justify-between mb-2">
          <a href={d.draft_link} target="_blank" rel="noopener noreferrer">
            Draft #{d.id} for Order {d.order_id}
          </a>
          <div className="flex gap-2">
            <Button onClick={() => approveDraft(d)}>Approve</Button>
            <Button onClick={() => rejectDraft(d)} variant="destructive">Reject</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DraftApproval;
