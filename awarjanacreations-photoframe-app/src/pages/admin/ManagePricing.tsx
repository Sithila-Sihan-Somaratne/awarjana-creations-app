import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { DEFAULT_PRICING_CONFIG } from "../../lib/pricing";
import type { PricingConfig } from "../../lib/pricing";


export default function ManagePricing() {
  const [config, setConfig] = useState<PricingConfig>(
    DEFAULT_PRICING_CONFIG
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /* ---------------------------------------------
     LOAD PRICING FROM SUPABASE
  --------------------------------------------- */
  useEffect(() => {
    const loadPricing = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("pricing_rules")
        .select("config")
        .single();

      if (error) {
        console.warn("No pricing row found, using defaults.");
        setConfig(DEFAULT_PRICING_CONFIG);
      } else {
        setConfig(data.config);
      }

      setLoading(false);
    };

    loadPricing();
  }, []);

  /* ---------------------------------------------
     SAVE PRICING TO SUPABASE
  --------------------------------------------- */
  const savePricing = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    const { error } = await supabase
      .from("pricing_rules")
      .upsert({ config });

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Pricing updated successfully.");
    }

    setSaving(false);
  };

  if (loading) return <p>Loading pricing…</p>;

  /* ---------------------------------------------
     UI (NO SHADCN MODIFICATIONS)
  --------------------------------------------- */
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Manage Pricing</h1>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      {/* BUSINESS RULES */}
      <section className="space-y-3">
        <h2 className="font-semibold">Business Rules</h2>

        <label className="block">
          Profit Margin (%)
          <input
            type="number"
            value={(config.business?.profitMarginPct ?? 0) * 100}
            onChange={(e) =>
              setConfig({
                ...config,
                business: {
                  ...config.business,
                  profitMarginPct:
                    Number(e.target.value) / 100,
                },
              })
            }
            className="border p-2 w-full"
          />
        </label>

        <label className="block">
          Urgent Multiplier
          <input
            type="number"
            value={config.business?.urgentMultiplier ?? 1}
            onChange={(e) =>
              setConfig({
                ...config,
                business: {
                  ...config.business,
                  urgentMultiplier: Number(e.target.value),
                },
              })
            }
            className="border p-2 w-full"
          />
        </label>
      </section>

      {/* OVERHEADS */}
      <section className="space-y-3">
        <h2 className="font-semibold">Overheads</h2>

        <label className="block">
          Wages
          <input
            type="number"
            value={config.overheads.wages}
            onChange={(e) =>
              setConfig({
                ...config,
                overheads: {
                  ...config.overheads,
                  wages: Number(e.target.value),
                },
              })
            }
            className="border p-2 w-full"
          />
        </label>

        <label className="block">
          Electricity
          <input
            type="number"
            value={config.overheads.electricity}
            onChange={(e) =>
              setConfig({
                ...config,
                overheads: {
                  ...config.overheads,
                  electricity: Number(e.target.value),
                },
              })
            }
            className="border p-2 w-full"
          />
        </label>
      </section>

      {/* MATERIAL COSTS (OPTIONAL EDIT) */}
      <section className="space-y-3">
        <h2 className="font-semibold">Materials</h2>

        {Object.entries(config.materials).map(
          ([key, value]) => (
            <label key={key} className="block">
              {key}
              <input
                type="number"
                value={value ?? 0}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    materials: {
                      ...config.materials,
                      [key]: Number(e.target.value),
                    },
                  })
                }
                className="border p-2 w-full"
              />
            </label>
          )
        )}
      </section>

      <button
        onClick={savePricing}
        disabled={saving}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {saving ? "Saving..." : "Save Pricing"}
      </button>
    </div>
  );
}
