import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const client = await serverSupabaseClient<Database>(event);

  const { data, error } = await client
    .from("cart_items")
    .select(
      `
      id,
      user_id,
      listing_id,
      quantity,
      created_at,
      listings(id, title, price, image_url, seller_id, status, profiles!listings_seller_id_fkey(display_name))
    `
    )
    .eq("user_id", user.id)
    .order("created_at");

  if (error) throw createError({ statusCode: 500, statusMessage: error.message });

  return data ?? [];
});
