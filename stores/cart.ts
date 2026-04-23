    import { defineStore } from "pinia";

    export interface CartItem {
      id: string;
      name: string;
      price: number;
      quantity: number;
      image: string;
      vendor: string;
    }

    export const useCartStore = defineStore("cart", () => {
      const items = ref<CartItem[]>([]);

      const total = computed(() =>
        items.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
      );
      const count = computed(() =>
        items.value.reduce((sum, i) => sum + i.quantity, 0)
      );

      function add(item: Omit<CartItem, "quantity">) {
        const existing = items.value.find((i) => i.id === item.id);
        if (existing) {
          existing.quantity++;
        } else {
          items.value.push({ ...item, quantity: 1 });
        }
      }

      function remove(id: string) {
        const idx = items.value.findIndex((i) => i.id === id);
        if (idx !== -1) items.value.splice(idx, 1);
      }

      function updateQty(id: string, qty: number) {
        const item = items.value.find((i) => i.id === id);
        if (!item) return;
        if (qty <= 0) { remove(id); return; }
        item.quantity = qty;
      }

      function clear() { items.value = []; }

      return { items, total, count, add, remove, updateQty, clear };
}, { persist: true });
