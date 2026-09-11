import { defineStore } from 'pinia';
import type { Cart, ApiResponse } from '~/types';
import { useApi } from '~/composables/useApi';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: null as Cart | null,
    loading: false,
    selectedItemIds: [] as string[],
  }),
  getters: {
    cartItems: (state) => state.cart?.items || [],
    cartCount: (state) => {
      if (!state.cart?.items) return 0;
      return state.cart.items.reduce((total, item) => total + item.quantity, 0);
    },
    cartTotal: (state) => {
      if (!state.cart?.items) return 0;
      return state.cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    },
    selectedItems: (state) => {
      if (!state.cart?.items) return [];
      return state.cart.items.filter(item => state.selectedItemIds.includes(item.id.toString()));
    },
    selectedTotal: (state) => {
      if (!state.cart?.items) return 0;
      return state.cart.items
        .filter(item => state.selectedItemIds.includes(item.id.toString()))
        .reduce((total, item) => total + (item.product.price * item.quantity), 0);
    },
  },
  actions: {
    async fetchCart() {
      this.loading = true;
      const { api } = useApi();
      try {
        const data = await api.get<ApiResponse<Cart>>('/cart');
        if (data.success) {
          this.cart = data.data;
        }
      } catch (error) {
        console.error('Failed to fetch cart', error);
      } finally {
        this.loading = false;
      }
    },
    async addItem(productId: number, quantity: number) {
      this.loading = true;
      const { api } = useApi();
      try {
        const data = await api.post<ApiResponse<Cart>>('/cart/items', { productId, quantity });
        if (data.success) {
          this.cart = data.data;
        }
      } catch (error) {
        console.error('Failed to add item', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateItem(itemId: string, quantity: number) {
      this.loading = true;
      const { api } = useApi();
      try {
        const data = await api.patch<ApiResponse<Cart>>(`/cart/items/${itemId}`, { quantity });
        if (data.success) {
          this.cart = data.data;
        }
      } catch (error) {
        console.error('Failed to update item', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async removeItem(itemId: string) {
      this.loading = true;
      const { api } = useApi();
      try {
        const data = await api.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`);
        if (data.success) {
          this.cart = data.data;
          this.selectedItemIds = this.selectedItemIds.filter(id => id !== itemId.toString());
        }
      } catch (error) {
        console.error('Failed to remove item', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    toggleSelectItem(itemId: string) {
      const idx = this.selectedItemIds.indexOf(itemId.toString());
      if (idx === -1) {
        this.selectedItemIds.push(itemId.toString());
      } else {
        this.selectedItemIds.splice(idx, 1);
      }
    },
    selectAllItems(selected: boolean) {
      if (selected && this.cart?.items) {
        this.selectedItemIds = this.cart.items.map(item => item.id.toString());
      } else {
        this.selectedItemIds = [];
      }
    },
    clearCart() {
      this.cart = null;
      this.selectedItemIds = [];
    }
  }
});

