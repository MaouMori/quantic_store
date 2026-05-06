import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Eye,
  EyeOff,
  Gem,
  Gift,
  Headphones,
  Heart,
  Lock,
  LogIn,
  Mail,
  MessageCircle,
  ShieldCheck,
  Skull,
  Sparkles,
  User,
  UserPlus,
  Zap,
} from 'lucide-react'
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
  const [remember, setRemember] = useState(false)
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
    <div className="relative min-h-screen overflow-hidden bg-black text-text-main">
      <div className="absolute inset-0">
        <img src="/hero/slide1.jpg" alt="" className="h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,45,149,0.20),transparent_34%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-neon-pink/30 bg-neon-pink/10 shadow-lg shadow-neon-pink/10">
              <Skull className="h-7 w-7 text-neon-pink" />
            </div>
            <div className="leading-none">
              <span className="block font-display text-3xl text-neon-pink tracking-wider">QUANTIC</span>
              <span className="block font-heading text-xs tracking-[0.38em] text-white">STORE</span>
            </div>
          </Link>
          <Link to="/" className="text-sm text-text-muted hover:text-neon-pink transition-colors">
            Voltar ao site
          </Link>
        </header>

        <main className="flex flex-1 items-center py-10">
          <div className="grid w-full overflow-hidden rounded-2xl border border-neon-pink/25 bg-black/55 shadow-2xl shadow-neon-pink/10 backdrop-blur-xl lg:grid-cols-[0.88fr_1fr]">
            <section className="p-6 sm:p-10 lg:p-14">
              <div className="mb-8">
                <p className="mb-4 flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wider text-neon-pink">
                  <Sparkles className="h-4 w-4" />
                  Bem-vinde de volta
                </p>
                <h1 className="font-display text-5xl leading-[0.95] tracking-wide text-white sm:text-6xl">
                  {mode === 'login' ? (
                    <>
                      Faca login
                      <span className="block text-neon-pink">na Quantic</span>
                    </>
                  ) : (
                    <>
                      Crie sua conta
                      <span className="block text-neon-pink">na Quantic</span>
                    </>
                  )}
                </h1>
                <p className="mt-5 max-w-sm text-sm leading-relaxed text-text-muted">
                  Acesse sua conta e descubra um universo de estilo, atitude e exclusividade.
                </p>
              </div>

              <div className="mb-8 flex items-center gap-3 text-neon-pink/70">
                <div className="h-px flex-1 bg-neon-pink/25" />
                <Zap className="h-5 w-5" />
                <div className="h-px flex-1 bg-neon-pink/25" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'register' && (
                  <div>
                    <label className="mb-2 block font-heading text-xs font-bold uppercase tracking-wider text-text-main">Nome</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neon-pink" />
                      <input
                        value={name}
                        onChange={event => setName(event.target.value)}
                        placeholder="Digite seu nome"
                        className="w-full rounded-lg border border-neon-pink/25 bg-black/35 px-4 py-4 pl-12 text-text-main placeholder-text-dim outline-none transition-colors focus:border-neon-pink/70"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-2 block font-heading text-xs font-bold uppercase tracking-wider text-text-main">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neon-pink" />
                    <input
                      type="email"
                      value={email}
                      onChange={event => setEmail(event.target.value)}
                      placeholder="Digite seu e-mail"
                      className="w-full rounded-lg border border-neon-pink/25 bg-black/35 px-4 py-4 pl-12 text-text-main placeholder-text-dim outline-none transition-colors focus:border-neon-pink/70"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-heading text-xs font-bold uppercase tracking-wider text-text-main">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neon-pink" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={event => setPassword(event.target.value)}
                      placeholder="Digite sua senha"
                      className="w-full rounded-lg border border-neon-pink/25 bg-black/35 px-4 py-4 pl-12 pr-12 text-text-main placeholder-text-dim outline-none transition-colors focus:border-neon-pink/70"
                      minLength={6}
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(show => !show)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-neon-pink">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <label className="flex items-center gap-2 text-text-muted">
                    <input type="checkbox" checked={remember} onChange={event => setRemember(event.target.checked)} className="h-4 w-4 accent-neon-pink" />
                    Lembrar de mim
                  </label>
                  <button type="button" className="text-neon-pink hover:text-hot-pink">
                    Esqueceu sua senha?
                  </button>
                </div>

                {error && <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400 text-sm">{error}</div>}
                {success && <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-green-400 text-sm">{success}</div>}

                <button disabled={loading} className="btn-shine w-full rounded-lg bg-neon-pink px-5 py-4 font-heading text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-neon-pink/35 transition-all hover:bg-hot-pink disabled:opacity-50 flex items-center justify-center gap-2">
                  {mode === 'login' ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                  {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar na minha conta' : 'Criar minha conta'}
                  <MessageCircle className="h-5 w-5" />
                </button>
              </form>

              <div className="my-8 flex items-center gap-3 text-xs text-text-dim">
                <div className="h-px flex-1 bg-neon-pink/15" />
                ou continue com
                <div className="h-px flex-1 bg-neon-pink/15" />
              </div>

              <button
                onClick={handleDiscordLogin}
                className="w-full rounded-lg border border-[#5865F2]/60 bg-[#5865F2]/15 px-4 py-3 font-heading text-xs font-bold uppercase tracking-wider text-[#9ba4ff] transition-colors hover:bg-[#5865F2]/25 flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                Entrar com Discord
              </button>

              <div className="mt-8 text-center text-sm text-text-muted">
                {mode === 'login' ? 'Ainda nao tem uma conta?' : 'Ja tem uma conta?'}
                <button
                  onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login')
                    setError('')
                    setSuccess('')
                  }}
                  className="ml-2 font-bold text-neon-pink hover:text-hot-pink"
                >
                  {mode === 'login' ? 'Criar conta agora' : 'Fazer login'}
                  <ArrowRight className="ml-1 inline h-4 w-4" />
                </button>
              </div>
            </section>

            <section className="relative hidden min-h-[720px] overflow-hidden border-l border-neon-pink/20 lg:block">
              <img src="/hero/slide1.jpg" alt="Quantic Store" className="absolute inset-0 h-full w-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-12">
                <p className="mb-7 font-heading text-sm font-bold uppercase tracking-wider text-white">Ao fazer login, voce desbloqueia:</p>
                <div className="space-y-6">
                  {[
                    { icon: Gem, title: 'Acesso a produtos exclusivos', text: 'Itens unicos que voce so encontra aqui.' },
                    { icon: Gift, title: 'Promocoes e beneficios', text: 'Descontos especiais para membros.' },
                    { icon: Zap, title: 'Entrega automatica via Discord', text: 'Seus produtos entregues na hora.' },
                    { icon: ShieldCheck, title: 'Compra 100% segura', text: 'Seus dados sempre protegidos.' },
                  ].map(item => (
                    <div key={item.title} className="flex gap-4">
                      <item.icon className="mt-0.5 h-8 w-8 flex-shrink-0 text-neon-pink" />
                      <div>
                        <h3 className="font-heading text-sm font-bold text-neon-pink">{item.title}</h3>
                        <p className="mt-1 text-sm text-text-muted">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>

        <section className="mb-10 rounded-xl border border-neon-pink/25 bg-black/50 p-5 backdrop-blur-xl">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Lock, title: 'Compra segura', text: 'Seus dados protegidos do inicio ao fim.' },
              { icon: Zap, title: 'Entrega rapida', text: 'Receba seus produtos direto no Discord.' },
              { icon: Headphones, title: 'Suporte humano', text: 'Atendimento exclusivo e humanizado.' },
              { icon: Heart, title: 'Comunidade ativa', text: 'Faca parte de uma comunidade incrivel.' },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-4 lg:border-r lg:border-neon-pink/10 last:border-r-0">
                <item.icon className="mt-1 h-9 w-9 flex-shrink-0 text-neon-pink" />
                <div>
                  <h3 className="font-heading text-sm font-bold uppercase text-neon-pink">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-text-muted">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="flex flex-col items-center justify-between gap-4 pb-6 text-sm text-text-dim sm:flex-row">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-2xl text-neon-pink">QUANTIC</span>
            <Heart className="h-4 w-4 fill-neon-pink text-neon-pink" />
          </Link>
          <span>(c) {new Date().getFullYear()} Quantic Store. Todos os direitos reservados.</span>
          <div className="flex gap-2">
            {[MessageCircle, Heart, Zap].map((Icon, index) => (
              <span key={index} className="flex h-9 w-9 items-center justify-center rounded-lg border border-neon-pink/25 text-neon-pink">
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  )
}
