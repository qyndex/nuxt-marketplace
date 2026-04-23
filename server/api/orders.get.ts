import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const client = await serverSupabaseClient<Database>(event);

  const { data, error } = await client
    .from("orders")
    .select(
      `
      id,
      buyer_id,
      total,
      status,
      created_at,
      order_items(id, listing_id, price, quantity, listings(title, image_url))
    `
    )
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw createError({ statusCode: 500, statusMessage: error.message });

  return data ?? [];
});
