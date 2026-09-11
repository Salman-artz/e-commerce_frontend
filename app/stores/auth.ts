import { defineStore } from 'pinia';
import type { User, ApiResponse } from '~/types';

export const useAuthStore = defineStore('auth', {
  state: () => {
    // Initial state from cookies if available
    const token = useCookie('auth_token').value
    const role = useCookie('user_role').value
    
    return {
      user: (role ? { role } : null) as User | null, // Minimal user object for role checking
      accessToken: (token as string) || null,
      loading: false,
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    isAdmin: (state) => state.user?.role === 'ADMIN',
    userName: (state) => state.user?.name || '',
  },
  actions: {
    setAuth(token: string, user: User) {
      this.accessToken = token;
      this.user = user;
      const tokenCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 });
      const roleCookie = useCookie('user_role', { maxAge: 60 * 60 * 24 });
      tokenCookie.value = token;
      roleCookie.value = user.role;
    },
    clearAuth() {
      this.accessToken = null;
      this.user = null;
      const tokenCookie = useCookie('auth_token');
      const roleCookie = useCookie('user_role');
      tokenCookie.value = null;
      roleCookie.value = null;
    },
    async login(email: string, password: string) {
      const config = useRuntimeConfig();
      this.loading = true;
      try {
        const data = await $fetch<ApiResponse<{ user: User; accessToken: string }>>('/auth/login', {
          baseURL: config.public.apiBase as string,
          method: 'POST',
          body: { email, password },
        });
        
        if (data.success) {
          this.setAuth(data.data.accessToken, data.data.user);
        }
        return data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async register(name: string, email: string, password: string) {
      const config = useRuntimeConfig();
      this.loading = true;
      try {
        const data = await $fetch<ApiResponse<{ user: User; accessToken: string }>>('/auth/register', {
          baseURL: config.public.apiBase as string,
          method: 'POST',
          body: { name, email, password },
        });
        
        if (data.success) {
          this.setAuth(data.data.accessToken, data.data.user);
        }
        return data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      const config = useRuntimeConfig();
      this.loading = true;
      try {
        await $fetch('/auth/logout', {
          baseURL: config.public.apiBase as string,
          method: 'POST',
          headers: this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : undefined,
        });
      } catch (error) {
        console.error('Logout error', error);
      } finally {
        this.clearAuth();
        this.loading = false;
      }
    },
    async fetchMe() {
      if (!this.accessToken) return null;
      const config = useRuntimeConfig();
      this.loading = true;
      try {
        const data = await $fetch<ApiResponse<User>>('/auth/me', {
          baseURL: config.public.apiBase as string,
          method: 'GET',
          headers: { Authorization: `Bearer ${this.accessToken}` },
        });
        if (data.success) {
          this.user = data.data;
        }
        return data.data;
      } catch (error) {
        this.user = null;
        this.accessToken = null;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async refreshToken() {
      const config = useRuntimeConfig();
      try {
        const data = await $fetch<ApiResponse<{ accessToken: string }>>('/auth/refresh-token', {
          baseURL: config.public.apiBase as string,
          method: 'POST',
        });
        if (data.success) {
          this.accessToken = data.data.accessToken;
          await this.fetchMe();
          return true;
        }
        return false;
      } catch (error) {
        this.user = null;
        this.accessToken = null;
        return false;
      }
    }
  }
});
