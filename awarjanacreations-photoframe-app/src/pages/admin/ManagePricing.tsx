// src/pages/admin/ManagePricing.tsx
import { useEffect, useState } from "react";
import type { PricingConfig } from "../../lib/pricing";
import { DEFAULT_PRICING_CONFIG } from "../../lib/pricing";
import { supabase } from "../../lib/supabaseClient";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function ManagePricing() {
  const [config, setConfig] = useState<PricingConfig>(DEFAULT_PRICING_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("pricing_rules").select("config").single();
      setConfig((data?.config as PricingConfig) || DEFAULT_PRICING_CONFIG);
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    setMsg(null);
    const { error } = await supabase.from("pricing_rules").upsert({ config });
    setMsg(error ? error.message : "Saved successfully");
    setSaving(false);
  };

  if (loading) return <p>Loading…</p>;

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Pricing</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm mb-1">Reference width (cm)</label>
          <Input type="number" value={config.reference.width_cm} onChange={(e) => setConfig({ ...config, reference: { ...config.reference, width_cm: Number(e.target.value) } })} />
        </div>

        <div>
          <label className="block text-sm mb-1">Reference height (cm)</label>
          <Input type="number" value={config.reference.height_cm} onChange={(e) => setConfig({ ...config, reference: { ...config.reference, height_cm: Number(e.target.value) } })} />
        </div>

        <div>
          <label className="block text-sm mb-1">Profit margin (%)</label>
          <Input type="number" value={(config.business.profitMarginPct || 0) * 100} onChange={(e) => setConfig({ ...config, business: { ...config.business, profitMarginPct: Number(e.target.value) / 100 } })} />
        </div>

        <div>
          <label className="block text-sm mb-1">Urgent multiplier</label>
          <Input type="number" value={config.business.urgentMultiplier} onChange={(e) => setConfig({ ...config, business: { ...config.business, urgentMultiplier: Number(e.target.value) } })} />
        </div>

        <div>
          <label className="block text-sm mb-1">Wages</label>
          <Input type="number" value={config.overheads.wages} onChange={(e) => setConfig({ ...config, overheads: { ...config.overheads, wages: Number(e.target.value) } })} />
        </div>

        <div>
          <label className="block text-sm mb-1">Electricity</label>
          <Input type="number" value={config.overheads.electricity} onChange={(e) => setConfig({ ...config, overheads: { ...config.overheads, electricity: Number(e.target.value) } })} />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm mb-2">Materials (per reference unit)</label>
          <div className="grid gap-3 md:grid-cols-3">
            {Object.entries(config.materials).map(([k, v]) => (
              <div key={k}>
                <label className="block text-xs text-neutral-300 mb-1">{k}</label>
                <Input type="number" value={v} onChange={(e) => setConfig({ ...config, materials: { ...config.materials, [k]: Number(e.target.value) } })} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Pricing"}</Button>
        {msg && <div className="text-sm text-neutral-300">{msg}</div>}
      </div>
    </Card>
  );
}
