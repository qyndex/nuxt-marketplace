import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/database";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);

  const { data, error } = await client
    .from("categories")
    .select("id, name, slug")
    .order("name");

  if (error) throw createError({ statusCode: 500, statusMessage: error.message });

  return data ?? [];
});
