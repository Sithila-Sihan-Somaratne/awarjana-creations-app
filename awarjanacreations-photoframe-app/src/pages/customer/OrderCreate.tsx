import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { calculatePrice } from "../../lib/pricing";

import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

type Product = {
  id: string;
  title: string;
  base_price: number;
};

type Size = {
  label: string;
  multiplier: number;
};

const OrderCreate = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [productId, setProductId] = useState<string>("");
  const [sizeLabel, setSizeLabel] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [urgency, setUrgency] = useState<"normal" | "urgent">("normal");
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    supabase.from("products").select("*").then(({ data }) => {
      setProducts((data || []) as Product[]);
      if (data && data.length > 0) setProductId(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (productId) {
      supabase
        .from("sizes")
        .select("*")
        .eq("product_id", productId)
        .then(({ data }) => {
          setSizes((data || []) as Size[]);
          if (data && data.length > 0) setSizeLabel(data[0].label);
        });
    }
  }, [productId]);

  useEffect(() => {
    const product = products.find((p) => p.id === productId);
    const sizeObj = sizes.find((s) => s.label === sizeLabel);
    if (product && sizeObj) {
      setPrice(
        calculatePrice({
          size: { label: sizeObj.label, multiplier: sizeObj.multiplier },
          quantity,
          urgency,
          basePrice: product.base_price,
        })
      );
    }
  }, [productId, sizeLabel, quantity, urgency, products, sizes]);

  function handleConfirmOrder() {
    alert(
      `Order submitted:\nProduct: ${productId}\nSize: ${sizeLabel}\nQty: ${quantity}\nUrgency: ${urgency}\nTotal: ${price}`
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-950">
      <Card className="w-full max-w-md bg-background border border-brand-500 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-brand-500 mb-6 text-center">
          Create New Order
        </h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="product" className="block font-semibold mb-1">
              Product
            </label>
            <select
              id="product"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full p-2 rounded border"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="size" className="block font-semibold mb-1">
              Size
            </label>
            <select
              id="size"
              value={sizeLabel}
              onChange={(e) => setSizeLabel(e.target.value)}
              className="w-full p-2 rounded border"
            >
              {sizes.map((s) => (
                <option key={s.label} value={s.label}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="quantity" className="block font-semibold mb-1">
              Quantity
            </label>
            <Input
              type="number"
              min={1}
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="urgency" className="block font-semibold mb-1">
              Urgency
            </label>
            <select
              id="urgency"
              value={urgency}
              onChange={(e) =>
                setUrgency(e.target.value as "normal" | "urgent")
              }
              className="w-full p-2 rounded border"
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="font-bold text-xl text-right text-brand-500 pt-3">
            Total: ₹{price}
          </div>
          <Button
            type="button"
            className="w-full mt-6"
            onClick={handleConfirmOrder}
          >
            Confirm Order
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default OrderCreate;