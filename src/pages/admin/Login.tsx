import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LogIn, Eye, EyeOff, Skull } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)

    if (result.success) {
      navigate('/admin')
    } else {
      setError(result.error || 'Email ou senha incorretos.')
    }

    setLoading(false)
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
          <p className="text-text-muted">Painel Administrativo</p>
        </div>

        <div className="review-card rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-2">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@quantic.store"
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-3 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-2">
                SENHA
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-3 pr-12 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50 transition-colors"
                  required
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

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neon-pink hover:bg-hot-pink disabled:opacity-50 text-white py-3 rounded-xl font-heading font-bold tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              {loading ? 'ENTRANDO...' : 'ENTRAR'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-neon-pink/10">
            <p className="text-text-dim text-xs text-center mb-2">
              Configure as variaveis de ambiente do Supabase para ativar o login real.
            </p>
            <p className="text-text-dim text-[10px] text-center">
              VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
