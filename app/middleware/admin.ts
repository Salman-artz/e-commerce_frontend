export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('auth_token')
  const userRole = useCookie('user_role')
  
  if (!token.value) {
    return navigateTo('/auth/login')
  }
  
  if (userRole.value !== 'ADMIN') {
    return navigateTo('/')
  }
})
