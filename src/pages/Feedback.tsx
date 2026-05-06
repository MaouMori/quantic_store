import { useEffect, useState } from 'react'
import { Heart, Send, Star } from 'lucide-react'
import { useAdmin } from '../context/useAdmin'
import { useAuth } from '../context/useAuth'

export default function Feedback() {
  const { addFeedback } = useAdmin()
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [discord, setDiscord] = useState('')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (user) {
        setName(user.name)
        setEmail(user.email)
      }
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [user])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setFeedback(null)

    if (!name.trim() || !text.trim()) {
      setFeedback({ type: 'error', message: 'Preencha seu nome e seu feedback.' })
      return
    }

    setSaving(true)
    const result = await addFeedback({
      name: name.trim(),
      email: email.trim() || undefined,
      discord: discord.trim() || undefined,
      rating,
      text: text.trim(),
    })
    setSaving(false)

    if (result.success) {
      setFeedback({ type: 'success', message: 'Obrigada! Seu feedback ja apareceu na home.' })
      setText('')
    } else {
      setFeedback({ type: 'error', message: result.error || 'Nao foi possivel enviar o feedback.' })
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <Heart className="w-10 h-10 text-neon-pink fill-neon-pink mx-auto mb-3" />
        <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wide">DEIXE SEU FEEDBACK</h1>
        <p className="text-text-muted text-sm mt-2">Conte como foi sua experiencia na Quantic Store.</p>
      </div>

      <form onSubmit={handleSubmit} className="review-card rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Nome</label>
            <input value={name} onChange={event => setName(event.target.value)}
              className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-neon-pink/50" required />
          </div>
          <div>
            <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Email opcional</label>
            <input type="email" value={email} onChange={event => setEmail(event.target.value)}
              className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-neon-pink/50" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Discord opcional</label>
          <input value={discord} onChange={event => setDiscord(event.target.value)}
            placeholder="@seuusuario"
            className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-3 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50" />
        </div>

        <div>
          <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-2">Nota</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(value => (
              <button key={value} type="button" onClick={() => setRating(value)} className="p-1 text-star">
                <Star className={`w-6 h-6 ${value <= rating ? 'fill-star' : ''}`} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-1">Feedback</label>
          <textarea value={text} onChange={event => setText(event.target.value)} rows={5}
            className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-neon-pink/50 resize-none" required />
        </div>

        {feedback && (
          <div className={`rounded-lg px-4 py-3 text-sm ${feedback.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
            {feedback.message}
          </div>
        )}

        <button disabled={saving} className="w-full bg-neon-pink hover:bg-hot-pink disabled:opacity-50 text-white py-3 rounded-xl font-heading font-bold tracking-wider transition-all flex items-center justify-center gap-2">
          <Send className="w-4 h-4" />
          {saving ? 'ENVIANDO...' : 'ENVIAR FEEDBACK'}
        </button>
      </form>
    </div>
  )
}
