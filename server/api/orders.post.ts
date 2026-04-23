import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { Database } from "~/types/database";

interface OrderItemInput {
  listing_id: string;
  price: number;
  quantity: number;
}

interface CreateOrderBody {
  items: OrderItemInput[];
}

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const body = await readBody<CreateOrderBody>(event);
  if (!body.items?.length) throw createError({ statusCode: 400, statusMessage: "Order must have at least one item" });

  const total = body.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const client = await serverSupabaseClient<Database>(event);

  // Create order
  const { data: order, error: orderError } = await client
    .from("orders")
    .insert({ buyer_id: user.id, total, status: "paid" })
    .select()
    .single();

  if (orderError || !order) {
    throw createError({ statusCode: 500, statusMessage: orderError?.message ?? "Failed to create order" });
  }

  // Insert order items
  const { error: itemsError } = await client
    .from("order_items")
    .insert(
      body.items.map((item) => ({
        order_id: order.id,
        listing_id: item.listing_id,
        price: item.price,
        quantity: item.quantity,
      }))
    );

  if (itemsError) throw createError({ statusCode: 500, statusMessage: itemsError.message });

  // Clear cart
  await client.from("cart_items").delete().eq("user_id", user.id);

  return order;
});
