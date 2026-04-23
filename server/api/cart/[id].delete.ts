import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing cart item id" });

  const client = await serverSupabaseClient<Database>(event);

  const { error } = await client
    .from("cart_items")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw createError({ statusCode: 500, statusMessage: error.message });

  return { success: true };
});
