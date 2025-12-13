import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SERVICE_KEY:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);


const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    const { code, role } = JSON.parse(event.body || "{}");
    if (!code || !role) return { statusCode: 400, body: JSON.stringify({ error: "Missing code or role" }) };

    const codeHash = createHash("sha256").update(code).digest("hex");

    const { data, error } = await supabase
      .from("registration_codes")
      .select("*")
      .eq("code_hash", codeHash)
      .eq("role", role)
      .eq("used", false)
      .single();

    if (error || !data) return { statusCode: 400, body: JSON.stringify({ error: "Invalid invite code" }) };

    await supabase.from("registration_codes").update({ used: true }).eq("id", data.id);

    return { statusCode: 200, body: JSON.stringify({ valid: true }) };

  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
