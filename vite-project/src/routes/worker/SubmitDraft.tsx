import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";

const SubmitDraft = () => {
  const { userId } = useAuth();
  const [orderId, setOrderId] = useState<number>(0);
  const [draftLink, setDraftLink] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmitDraft = async () => {
    setLoading(true);
    const { error } = await supabase.from("drafts").insert([
      { order_id: orderId, worker_id: userId, draft_link: draftLink, created_at: new Date().toISOString() }
    ]);

    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Success", description: "Draft submitted!" });

    setOrderId(0);
    setDraftLink("");
    setLoading(false);
  };

  return (
    <div className="p-4 bg-black rounded shadow-lg text-white">
      <h2 className="text-yellow-400 text-2xl mb-4">Submit Draft</h2>
      <div className="flex flex-col gap-2">
        <Input type="number" placeholder="Order ID" value={orderId || ""} onChange={(e) => setOrderId(Number(e.target.value))} />
        <Input placeholder="Draft Link" value={draftLink} onChange={(e) => setDraftLink(e.target.value)} />
        <Button onClick={handleSubmitDraft} disabled={loading}>
          {loading ? "Submitting..." : "Submit Draft"}
        </Button>
      </div>
    </div>
  );
};

export default SubmitDraft;
