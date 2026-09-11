import { useAuthStore } from '~/stores/auth';

export const useApi = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  
  const customFetch = $fetch.create({
    baseURL: config.public.apiBase as string,
    onRequest({ options }) {
      if (authStore.accessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authStore.accessToken}`
        };
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        authStore.logout();
      }
    }
  });

  const api = {
    get: <T>(url: string, options?: any) => customFetch<T>(url, { ...options, method: 'GET' }),
    post: <T>(url: string, body?: any, options?: any) => customFetch<T>(url, { ...options, method: 'POST', body }),
    patch: <T>(url: string, body?: any, options?: any) => customFetch<T>(url, { ...options, method: 'PATCH', body }),
    delete: <T>(url: string, options?: any) => customFetch<T>(url, { ...options, method: 'DELETE' }),
  };

  return { api };
};
