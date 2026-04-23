import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { Database } from "~/types/database";

interface CreateListingBody {
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const body = await readBody<CreateListingBody>(event);

  if (!body.title?.trim()) throw createError({ statusCode: 400, statusMessage: "Title is required" });
  if (!body.price || body.price <= 0) throw createError({ statusCode: 400, statusMessage: "Price must be greater than 0" });
  if (!body.category?.trim()) throw createError({ statusCode: 400, statusMessage: "Category is required" });

  const client = await serverSupabaseClient<Database>(event);

  const { data, error } = await client
    .from("listings")
    .insert({
      title: body.title.trim(),
      description: body.description?.trim() ?? "",
      price: body.price,
      image_url: body.image_url?.trim() ?? "",
      category: body.category.trim(),
      seller_id: user.id,
      status: "active",
    })
    .select()
    .single();

  if (error) throw createError({ statusCode: 500, statusMessage: error.message });

  return data;
});
