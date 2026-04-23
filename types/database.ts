export interface Database {
  public: {
    Tables: {
      listings: {
        Row: Listing;
        Insert: Omit<Listing, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<Listing, "id">>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, "id"> & { id?: string };
        Update: Partial<Omit<Category, "id">>;
      };
      cart_items: {
        Row: CartItem;
        Insert: Omit<CartItem, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<CartItem, "id">>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<Order, "id">>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, "id"> & { id?: string };
        Update: Partial<Omit<OrderItem, "id">>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at"> & { created_at?: string; updated_at?: string };
        Update: Partial<Omit<Profile, "id">>;
      };
    };
  };
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  seller_id: string;
  status: "active" | "inactive" | "sold";
  created_at: string;
  // joined fields
  profiles?: Pick<Profile, "display_name" | "avatar_url">;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  listing_id: string;
  quantity: number;
  created_at: string;
  listings?: Listing;
}

export interface Order {
  id: string;
  buyer_id: string;
  total: number;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  listing_id: string;
  price: number;
  quantity: number;
  listings?: Listing;
}

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// Local cart item (guest + logged-in)
export interface LocalCartItem {
  id: string;
  listing_id: string;
  title: string;
  price: number;
  image_url: string;
  seller_name: string;
  quantity: number;
}
