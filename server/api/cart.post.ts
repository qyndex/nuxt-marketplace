import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { Database } from "~/types/database";

interface CartBody {
  listing_id: string;
  quantity?: number;
}

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const body = await readBody<CartBody>(event);
  if (!body.listing_id) throw createError({ statusCode: 400, statusMessage: "listing_id required" });

  const qty = Math.max(1, Math.floor(body.quantity ?? 1));
  const client = await serverSupabaseClient<Database>(event);

  const { data, error } = await client
    .from("cart_items")
    .upsert(
      { user_id: user.id, listing_id: body.listing_id, quantity: qty },
      { onConflict: "user_id,listing_id" }
    )
    .select()
    .single();

  if (error) throw createError({ statusCode: 500, statusMessage: error.message });

  return data;
});
