import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { Database } from "~/types/database";

interface UpdateProfileBody {
  display_name?: string;
  avatar_url?: string | null;
}

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const body = await readBody<UpdateProfileBody>(event);
  const client = await serverSupabaseClient<Database>(event);

  const updates: UpdateProfileBody = {};
  if (body.display_name !== undefined) updates.display_name = body.display_name.trim();
  if (body.avatar_url !== undefined) updates.avatar_url = body.avatar_url;

  const { data, error } = await client
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  if (error) throw createError({ statusCode: 500, statusMessage: error.message });

  return data;
});
