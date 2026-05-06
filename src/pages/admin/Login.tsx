import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuthErrorMessage } from '../../lib/authErrors'
import { useAuth } from '../../context/useAuth'
import { LogIn, Eye, EyeOff, Skull, UserPlus, ArrowLeft } from 'lucide-react'

export default function Login() {
  const { login, logout, signUp } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const normalizedEmail = email.replace(/\s+/g, '').trim().toLowerCase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const result = await login(normalizedEmail, password)
        if (result.success) {
          if (result.user?.role === 'Administrador') {
            navigate('/admin')
          } else {
            await logout()
            setError('Acesso restrito a administradores. Confirme se seu perfil esta com role Administrador no Supabase.')
          }
        } else {
          setError(result.error || 'Email ou senha incorretos.')
        }
      } else if (mode === 'register') {
        if (!name.trim()) {
          setError('Digite seu nome.')
          return
        }
        const result = await signUp(normalizedEmail, password, name)
        if (result.success) {
          setEmail(normalizedEmail)
          setSuccess('Conta criada! Verifique seu email para confirmar. Depois, confirme que o perfil esta como Administrador no Supabase.')
          setMode('login')
        } else {
          setError(result.error || 'Erro ao criar conta.')
        }
      } else if (mode === 'forgot') {
        const { error } = await import('../../lib/supabase').then(m => m.supabase.auth.resetPasswordForEmail(normalizedEmail, {
          redirectTo: `${window.location.origin}/admin/reset-password`,
        }))
        if (error) {
          setError(getAuthErrorMessage(error.message))
        } else {
          setSuccess('Email de recuperacao enviado! Verifique sua caixa de entrada.')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado ao processar login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4">
      <div className="noise-overlay" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Skull className="w-8 h-8 text-neon-pink" />
            <span className="font-display text-3xl text-neon-pink tracking-wider">QUANTIC</span>
          </div>
          <p className="text-text-muted">
            {mode === 'login' && 'Painel Administrativo'}
            {mode === 'register' && 'Criar nova conta'}
            {mode === 'forgot' && 'Recuperar senha'}
          </p>
        </div>

        <div className="review-card rounded-2xl p-6 sm:p-8">
          {mode !== 'login' && (
            <button
              onClick={() => { setMode('login'); setError(''); setSuccess('') }}
              className="flex items-center gap-1 text-text-dim hover:text-neon-pink text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-2">NOME</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-3 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50 transition-colors"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-2">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-3 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50 transition-colors"
                required
              />
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-2">SENHA</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-3 pr-12 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50 transition-colors"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-neon-pink transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 text-red-400 text-sm">{error}</div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2 text-green-400 text-sm">{success}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neon-pink hover:bg-hot-pink disabled:opacity-50 text-white py-3 rounded-xl font-heading font-bold tracking-wider transition-all flex items-center justify-center gap-2"
            >
              {mode === 'login' && <><LogIn className="w-5 h-5" />{loading ? 'ENTRANDO...' : 'ENTRAR'}</>}
              {mode === 'register' && <><UserPlus className="w-5 h-5" />{loading ? 'CRIANDO...' : 'CRIAR CONTA'}</>}
              {mode === 'forgot' && <>{loading ? 'ENVIANDO...' : 'ENVIAR EMAIL'}</>}
            </button>
          </form>

          {mode === 'login' && (
            <div className="mt-6 pt-4 border-t border-neon-pink/10 space-y-3">
              <button
                onClick={() => { setMode('register'); setError(''); setSuccess('') }}
                className="w-full text-center text-sm text-neon-pink hover:text-hot-pink transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Criar nova conta
              </button>
              <button
                onClick={() => { setMode('forgot'); setError(''); setSuccess('') }}
                className="w-full text-center text-xs text-text-dim hover:text-text-main transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
