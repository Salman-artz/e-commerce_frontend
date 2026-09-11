export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  
  const api = $fetch.create({
    baseURL: config.public.apiBase as string,
    onRequest({ request, options }) {
      const token = useCookie('auth_token').value
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`
        }
      }
    },
    async onResponseError({ request, response, options }) {
      if (response.status === 401) {
        // Clear token on unauthorized
        const token = useCookie('auth_token')
        token.value = null
        
        // Redirect to login
        await navigateTo('/auth/login')
      }
    }
  })

  return {
    provide: {
      api
    }
  }
})
