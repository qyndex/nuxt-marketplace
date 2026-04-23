import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing listing id" });

  const client = await serverSupabaseClient<Database>(event);

  const { data: existing } = await client
    .from("listings")
    .select("seller_id")
    .eq("id", id)
    .single();

  if (!existing || existing.seller_id !== user.id) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const { error } = await client
    .from("listings")
    .delete()
    .eq("id", id);

  if (error) throw createError({ statusCode: 500, statusMessage: error.message });

  return { success: true };
});
