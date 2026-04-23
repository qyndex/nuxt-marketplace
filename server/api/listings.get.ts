export interface Listing {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  vendor: string;
  rating: number;
  reviews: number;
  badge?: string;
  description: string;
}

const LISTINGS: Listing[] = [
  { id: "l1", name: "Handcrafted Ceramic Mug", price: 34.99, image: "https://placehold.co/480x360?text=Mug", category: "kitchen", vendor: "PotteryStudio", rating: 4.9, reviews: 203, description: "Hand-thrown ceramic mug with a speckled glaze." },
  { id: "l2", name: "Vintage Denim Jacket", price: 89.99, image: "https://placehold.co/480x360?text=Jacket", category: "fashion", vendor: "RetroWear", rating: 4.6, reviews: 87, badge: "Popular", description: "Classic vintage denim jacket, lightly worn condition." },
  { id: "l3", name: "Wooden Chess Set", price: 124.99, image: "https://placehold.co/480x360?text=Chess", category: "games", vendor: "WoodWorks", rating: 4.8, reviews: 142, description: "Handmade walnut and maple chess board with weighted pieces." },
  { id: "l4", name: "Succulent Arrangement", price: 29.99, image: "https://placehold.co/480x360?text=Plants", category: "home", vendor: "GreenThumb", rating: 4.7, reviews: 56, badge: "New", description: "Curated succulent arrangement in a terracotta pot." },
  { id: "l5", name: "Leather Journal", price: 44.99, image: "https://placehold.co/480x360?text=Journal", category: "stationery", vendor: "BinderyArts", rating: 4.5, reviews: 98, description: "Hand-bound A5 leather journal, 200 pages." },
  { id: "l6", name: "Hand-poured Soy Candle", price: 24.99, image: "https://placehold.co/480x360?text=Candle", category: "home", vendor: "WickLab", rating: 4.8, reviews: 311, description: "All-natural soy wax candle, cedarwood and vanilla scent." },
];

export default defineEventHandler((): Listing[] => LISTINGS);
