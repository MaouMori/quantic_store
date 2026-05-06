import { useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { getAuthErrorMessage } from '../lib/authErrors'
import { AuthContext } from './authContextValue'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  roleColor: string
  permissions: string[]
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>
  logout: () => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
}

type ProfileRow = {
  id: string
  name: string | null
  email: string | null
  avatar: string | null
  role: string | null
  role_color: string | null
  permissions: string[] | null
}

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

const normalizeEmail = (email: string) =>
  email
    .normalize('NFKC')
    .replace(/[\s\u200B-\u200D\uFEFF]/g, '')
    .trim()
    .toLowerCase()
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const withTimeout = async <T,>(promise: PromiseLike<T>, timeoutMs: number, message: string): Promise<T> => {
  let timeoutId: number | undefined
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(message)), timeoutMs)
  })

  try {
    return await Promise.race([Promise.resolve(promise), timeout])
  } finally {
    if (timeoutId) window.clearTimeout(timeoutId)
  }
}

const getAuthUserName = (authUser: SupabaseUser) => {
  const metadataName = authUser.user_metadata?.name
  if (typeof metadataName === 'string' && metadataName.trim()) return metadataName
  return authUser.email?.split('@')[0] || 'Usuario'
}

const mapProfileToUser = (profile: ProfileRow, authUser?: SupabaseUser): User => ({
  id: profile.id,
  name: profile.name || (authUser ? getAuthUserName(authUser) : 'Usuario'),
  email: profile.email || authUser?.email || '',
  avatar: profile.avatar || '/avatars/default.jpg',
  role: profile.role || 'Cliente',
  roleColor: profile.role_color || '#ff2d95',
  permissions: profile.permissions || [],
})

const buildFallbackUser = (authUser: SupabaseUser): User => ({
  id: authUser.id,
  name: getAuthUserName(authUser),
  email: authUser.email || '',
  avatar: '/avatars/default.jpg',
  role: 'Cliente',
  roleColor: '#ff2d95',
  permissions: [],
})

const getErrorMessage = (err: unknown) => {
  return err instanceof Error ? getAuthErrorMessage(err.message) : 'Erro ao conectar com o servidor.'
}

const createUserThroughServer = async (email: string, password: string, name: string) => {
  const response = await fetch('/api/register-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    return { success: false, error: data.error || 'Nao foi possivel criar a conta pelo servidor.' }
  }

  return { success: true }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured())

  const fetchProfile = useCallback(async (authUser: SupabaseUser) => {
    const { data, error } = await withTimeout(
      supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle<ProfileRow>(),
      8000,
      'Tempo esgotado ao carregar o perfil do usuario.'
    )

    if (error) {
      console.warn('Erro ao buscar perfil do usuario:', error.message)
      return buildFallbackUser(authUser)
    }

    if (data) return mapProfileToUser(data, authUser)
    return buildFallbackUser(authUser)
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return
    }

    const initAuth = async () => {
      try {
        const { data: { session } } = await withTimeout(
          supabase.auth.getSession(),
          8000,
          'Tempo esgotado ao recuperar a sessao.'
        )
        if (session?.user) {
          const profile = await fetchProfile(session.user)
          setUser(profile)
        }
      } catch (err) {
        console.error('Auth init error:', err)
      }
      setIsLoading(false)
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        window.setTimeout(() => {
          void (async () => {
            if (session?.user) {
              const profile = await fetchProfile(session.user)
              setUser(profile)
            } else {
              setUser(null)
            }
          })()
        }, 0)
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase nao configurado. Verifique as variaveis de ambiente.' }
    }

    const normalizedEmail = normalizeEmail(email)
    const normalizedName = name.trim()

    if (!isValidEmail(normalizedEmail)) {
      return { success: false, error: 'Email invalido. Confira se nao ha espacos ou caracteres errados.' }
    }

    if (password.length < 6) {
      return { success: false, error: 'A senha precisa ter pelo menos 6 caracteres.' }
    }

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { name: normalizedName },
        emailRedirectTo: `${window.location.origin}/admin/login`,
      },
    })

    if (error) {
      const serverResult = await createUserThroughServer(normalizedEmail, password, normalizedName)
      if (serverResult.success) return { success: true }
      if (serverResult.error?.includes('SUPABASE_SERVICE_ROLE_KEY')) {
        return { success: false, error: getAuthErrorMessage(error.message) }
      }
      return { success: false, error: serverResult.error || getAuthErrorMessage(error.message) }
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        name: normalizedName,
        email: normalizedEmail,
        role: 'Cliente',
        role_color: '#ff2d95',
        permissions: [],
      }, { onConflict: 'id' })

      if (profileError) {
        return { success: false, error: `Conta criada, mas o perfil nao foi salvo: ${profileError.message}` }
      }
    }

    return { success: true }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase nao configurado. Verifique as variaveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.' }
    }

    const normalizedEmail = normalizeEmail(email)

    if (!isValidEmail(normalizedEmail)) {
      return { success: false, error: 'Email invalido. Confira se nao ha espacos ou caracteres errados.' }
    }

    try {
      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        }),
        10000,
        'Tempo esgotado ao entrar. Verifique sua conexao e tente novamente.'
      )

      if (error) return { success: false, error: getAuthErrorMessage(error.message) }

      if (data.user) {
        const profile = await fetchProfile(data.user)
        setUser(profile)
        return { success: true, user: profile }
      }

      return { success: true }
    } catch (err: unknown) {
      return { success: false, error: getErrorMessage(err) }
    }
  }, [fetchProfile])

  const logout = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setUser(null)
      return
    }
    await supabase.auth.signOut()
    setUser(null)
  }, [])

  const isAdmin = user?.role === 'Administrador'
  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isAdmin, isLoading, login, logout, signUp }}
    >
      {children}
    </AuthContext.Provider>
  )
}
