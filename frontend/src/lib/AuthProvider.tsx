import { useEffect, useState, type ReactNode } from 'react'
import { apiGet, apiPost, setSessionExpiredHandler } from './api'
import { AuthContext } from './authContext'
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from './tokens'
import type { User } from './types'

type SignInResponse = {
  access_token: string
  refresh: string
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  // We only need to wait if there's a token from last time to check
  const [loading, setLoading] = useState(getAccessToken() !== null)

  useEffect(() => {
    setSessionExpiredHandler(() => setUser(null))

    // If we already have a token from last time, find out who is logged in
    if (!getAccessToken()) {
      return
    }

    apiGet<User>('/accounts/me/')
      .then((me) => setUser(me))
      .catch(() => {
        clearTokens()
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  async function signIn(email: string, password: string) {
    clearTokens()
    const tokens = await apiPost<SignInResponse>('/accounts/signin/', { email: email, password: password })
    saveTokens(tokens.access_token, tokens.refresh)

    const me = await apiGet<User>('/accounts/me/')
    setUser(me)
    return me
  }

  async function signOut() {
    const refresh = getRefreshToken()
    if (refresh) {
      try {
        await apiPost('/accounts/signout/', { refresh: refresh })
      } catch {
        // Even if the server call fails we still log out on this device
      }
    }
    clearTokens()
    setUser(null)
  }

  const value = { user: user, loading: loading, signIn: signIn, signOut: signOut, setUser: setUser }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
