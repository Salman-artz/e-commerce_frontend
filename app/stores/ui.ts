import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    isCartDrawerOpen: false,
    isMobileMenuOpen: false,
  }),
  actions: {
    toggleCartDrawer() {
      this.isCartDrawerOpen = !this.isCartDrawerOpen;
      if (this.isCartDrawerOpen) {
        this.isMobileMenuOpen = false;
      }
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
      if (this.isMobileMenuOpen) {
        this.isCartDrawerOpen = false;
      }
    },
    closeAll() {
      this.isCartDrawerOpen = false;
      this.isMobileMenuOpen = false;
    }
  }
});
