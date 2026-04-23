import { serverSupabaseClient } from "#supabase/server";
import type { Database, Listing } from "~/types/database";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing listing id" });

  const client = await serverSupabaseClient<Database>(event);

  const { data, error } = await client
    .from("listings")
    .select(
      `
      id,
      title,
      description,
      price,
      image_url,
      category,
      seller_id,
      status,
      created_at,
      profiles!listings_seller_id_fkey(display_name, avatar_url)
    `
    )
    .eq("id", id)
    .single<Listing>();

  if (error) {
    const code = error.code === "PGRST116" ? 404 : 500;
    throw createError({ statusCode: code, statusMessage: error.message });
  }

  return data;
});
