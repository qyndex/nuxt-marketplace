import { serverSupabaseClient } from "#supabase/server";
import type { Database, Listing } from "~/types/database";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const search = typeof query.search === "string" ? query.search.trim() : "";
  const category = typeof query.category === "string" ? query.category.trim() : "";
  const minPrice = Number(query.minPrice ?? 0);
  const maxPrice = Number(query.maxPrice ?? 99999);
  const sort = typeof query.sort === "string" ? query.sort : "created_at";
  const order = query.order === "asc" ? true : false;

  const client = await serverSupabaseClient<Database>(event);

  let dbQuery = client
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
    .eq("status", "active")
    .gte("price", minPrice)
    .lte("price", maxPrice);

  if (search) {
    dbQuery = dbQuery.textSearch("title", search, {
      type: "websearch",
      config: "english",
    });
  }

  if (category && category !== "all") {
    dbQuery = dbQuery.eq("category", category);
  }

  const allowedSorts: Record<string, string> = {
    created_at: "created_at",
    price: "price",
    title: "title",
  };
  const sortColumn = allowedSorts[sort] ?? "created_at";
  dbQuery = dbQuery.order(sortColumn, { ascending: order });

  const { data, error } = await dbQuery.returns<Listing[]>();

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return data ?? [];
});
