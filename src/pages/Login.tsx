import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, LogIn, MessageCircle, UserPlus } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export default function Login() {
  const { login, signUp, loginWithDiscord } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const requestedPath = (location.state as { from?: string } | null)?.from
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (mode === 'login') {
      const result = await login(email, password)
      setLoading(false)
      if (!result.success) {
        setError(result.error || 'Nao foi possivel entrar.')
        return
      }
      navigate(result.user?.role === 'Administrador' && requestedPath === '/admin' ? '/admin' : '/')
      return
    }

    const result = await signUp(email, password, name)
    setLoading(false)
    if (!result.success) {
      setError(result.error || 'Nao foi possivel criar a conta.')
      return
    }

    setSuccess('Conta criada. Agora voce ja pode entrar no site.')
    setMode('login')
  }

  const handleDiscordLogin = async () => {
    setError('')
    const result = await loginWithDiscord()
    if (!result.success) setError(result.error || 'Nao foi possivel entrar com Discord.')
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="review-card rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            onClick={() => mode === 'register' ? setMode('login') : navigate(-1)}
            className="flex items-center gap-1 text-text-dim hover:text-neon-pink text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <Link to="/" className="text-text-dim hover:text-neon-pink text-sm transition-colors">
            Ir para home
          </Link>
        </div>

        <div className="text-center mb-6">
          <h1 className="font-display text-4xl text-white tracking-wide">
            {mode === 'login' ? 'ENTRAR' : 'CRIAR CONTA'}
          </h1>
          <p className="text-text-muted text-sm mt-2">
            {mode === 'login' ? 'Acesse sua conta da Quantic Store.' : 'Crie sua conta para acompanhar pedidos.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-2">NOME</label>
              <input value={name} onChange={event => setName(event.target.value)}
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-neon-pink/50" required />
            </div>
          )}

          <div>
            <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-2">EMAIL</label>
            <input type="email" value={email} onChange={event => setEmail(event.target.value)}
              className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-neon-pink/50" required />
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-2">SENHA</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={event => setPassword(event.target.value)}
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-3 pr-12 text-text-main focus:outline-none focus:border-neon-pink/50" minLength={6} required />
              <button type="button" onClick={() => setShowPassword(show => !show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-neon-pink">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400 text-sm">{error}</div>}
          {success && <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-green-400 text-sm">{success}</div>}

          <button disabled={loading} className="w-full bg-neon-pink hover:bg-hot-pink disabled:opacity-50 text-white py-3 rounded-xl font-heading font-bold tracking-wider transition-all flex items-center justify-center gap-2">
            {mode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            {loading ? 'AGUARDE...' : mode === 'login' ? 'ENTRAR NO SITE' : 'CRIAR CONTA'}
          </button>
        </form>

        <button
          onClick={handleDiscordLogin}
          className="mt-3 w-full bg-[#5865F2] hover:bg-[#4752C4] text-white py-3 rounded-xl font-heading font-bold tracking-wider transition-all flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          ENTRAR COM DISCORD
        </button>

        <div className="mt-6 pt-4 border-t border-neon-pink/10 text-center">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login')
              setError('')
              setSuccess('')
            }}
            className="text-neon-pink hover:text-hot-pink text-sm transition-colors"
          >
            {mode === 'login' ? 'Criar nova conta' : 'Ja tenho uma conta'}
          </button>
        </div>
      </div>
    </div>
  )
}
