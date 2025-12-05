// src/pages/customer/OrderCreate.tsx
import React, { useEffect, useState } from "react";
import CustomerLayout from "../../components/layout/CustomerLayout";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { supabase } from "../../lib/supabaseClient";
import { DEFAULT_PRICING_CONFIG, calculatePrice } from "../../lib/pricing";
import type { PricingConfig } from "../../lib/pricing";

const formatCurrency = (n: number) => n.toLocaleString(undefined, { style: "currency", currency: "LKR" });

const OrderCreate: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [productId, setProductId] = useState<string>("");
  const [sizeLabel, setSizeLabel] = useState<string>("");
  const [qty, setQty] = useState<number>(1);
  const [urgency, setUrgency] = useState<"normal" | "urgent">("normal");
  const [pricingConfig, setPricingConfig] = useState<PricingConfig | null>(null);
  const [preview, setPreview] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("products").select("*");
      setProducts(data || []);
      if (data?.length) setProductId(data[0].id);
    })();

    (async () => {
      const { data } = await supabase.from("pricing_rules").select("config").single();
      setPricingConfig((data?.config as PricingConfig) || DEFAULT_PRICING_CONFIG);
    })();
  }, []);

  useEffect(() => {
    if (!productId) { setSizes([]); return; }
    (async () => {
      const { data } = await supabase.from("sizes").select("*").eq("product_id", productId);
      setSizes(data || []);
      if (data?.length) setSizeLabel(data[0].label);
    })();
  }, [productId]);

  useEffect(() => {
    if (!pricingConfig || !sizeLabel) { setPreview(0); return; }
    const size = sizes.find((s) => s.label === sizeLabel) || {};
    const width = size.width_cm ?? pricingConfig.reference.width_cm;
    const height = size.height_cm ?? pricingConfig.reference.height_cm;
    const total = calculatePrice(pricingConfig, width, height, Math.max(1, Math.floor(qty)), urgency === "urgent");
    setPreview(total);
  }, [pricingConfig, sizeLabel, qty, urgency, sizes]);

  async function submitOrder() {
    // This is client preview only. Real submission should call server-side function.
    alert(`Submitting order preview: ${formatCurrency(preview)}`);
  }

  return (
    <CustomerLayout>
      <div className="max-w-3xl mx-auto">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Create Order</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm mb-1">Product</label>
              <select value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full p-2 rounded bg-neutral-800">
                {products.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Size</label>
              <select value={sizeLabel} onChange={(e) => setSizeLabel(e.target.value)} className="w-full p-2 rounded bg-neutral-800">
                {sizes.map((s) => <option key={s.label} value={s.label}>{s.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Quantity</label>
              <Input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value || 1))} />
            </div>

            <div>
              <label className="block text-sm mb-1">Urgency</label>
              <select value={urgency} onChange={(e) => setUrgency(e.target.value as any)} className="w-full p-2 rounded bg-neutral-800">
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-lg">Preview Total</div>
            <div className="text-2xl font-extrabold text-green-300">{formatCurrency(preview)}</div>
          </div>

          <div className="mt-4 flex gap-3">
            <Button onClick={submitOrder}>Confirm (preview)</Button>
            <Button variant="outline">Save Draft</Button>
          </div>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default OrderCreate;
