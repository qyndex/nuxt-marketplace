import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const client = await serverSupabaseClient<Database>(event);

  const { data, error } = await client
    .from("profiles")
    .select("id, email, display_name, avatar_url, created_at, updated_at")
    .eq("id", user.id)
    .single();

  if (error) throw createError({ statusCode: 500, statusMessage: error.message });

  return data;
});
