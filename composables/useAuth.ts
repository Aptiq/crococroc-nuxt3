export function useAuth() {
  const token = useCookie('auth_token')
  const user = useState('auth_user', () => null)

  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken: string) {
    token.value = newToken
  }

  async function fetchUser() {
    if (!token.value) return null

    try {
      const userData = await $fetch('/api/auth/me')
      user.value = userData
      return userData
    } catch {
      token.value = null
      user.value = null
      return null
    }
  }

  async function logout() {
    token.value = null
    user.value = null
    navigateTo('/auth/login')
  }

  return {
    token,
    user,
    isAuthenticated,
    setToken,
    fetchUser,
    logout
  }
} 