import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { Database } from "~/types/database";

interface UpdateListingBody {
  title?: string;
  description?: string;
  price?: number;
  image_url?: string;
  category?: string;
  status?: "active" | "inactive" | "sold";
}

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing listing id" });

  const body = await readBody<UpdateListingBody>(event);
  const client = await serverSupabaseClient<Database>(event);

  // Verify ownership
  const { data: existing } = await client
    .from("listings")
    .select("seller_id")
    .eq("id", id)
    .single();

  if (!existing || existing.seller_id !== user.id) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const updates: UpdateListingBody = {};
  if (body.title !== undefined) updates.title = body.title.trim();
  if (body.description !== undefined) updates.description = body.description.trim();
  if (body.price !== undefined) updates.price = body.price;
  if (body.image_url !== undefined) updates.image_url = body.image_url.trim();
  if (body.category !== undefined) updates.category = body.category.trim();
  if (body.status !== undefined) updates.status = body.status;

  const { data, error } = await client
    .from("listings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw createError({ statusCode: 500, statusMessage: error.message });

  return data;
});
