import { useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
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

const normalizeEmail = (email: string) => email.trim().toLowerCase()

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
  return err instanceof Error ? err.message : 'Erro ao conectar com o servidor.'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured())

  const fetchProfile = useCallback(async (authUser: SupabaseUser) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle<ProfileRow>()

    if (error) {
      console.warn('Erro ao buscar perfil do usuario:', error.message)
      return buildFallbackUser(authUser)
    }

    if (data) return mapProfileToUser(data, authUser)

    const fallbackUser = buildFallbackUser(authUser)
    const { data: createdProfile, error: createError } = await supabase
      .from('profiles')
      .upsert({
        id: authUser.id,
        name: fallbackUser.name,
        email: fallbackUser.email,
        role: fallbackUser.role,
        role_color: fallbackUser.roleColor,
        permissions: fallbackUser.permissions,
      }, { onConflict: 'id' })
      .select('*')
      .maybeSingle<ProfileRow>()

    if (createError) {
      console.warn('Erro ao criar perfil do usuario:', createError.message)
      return fallbackUser
    }

    return createdProfile ? mapProfileToUser(createdProfile, authUser) : fallbackUser
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return
    }

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
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
      async (_event, session) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user)
          setUser(profile)
        } else {
          setUser(null)
        }
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

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { name: normalizedName },
        emailRedirectTo: `${window.location.origin}/admin/login`,
      },
    })

    if (error) return { success: false, error: error.message }

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

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      })

      if (error) return { success: false, error: error.message }

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
