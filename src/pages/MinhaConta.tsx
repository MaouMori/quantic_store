import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Heart, KeyRound, Mail, Save, Upload, User } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/useAuth'

export default function MinhaConta() {
  const { user, isAuthenticated, updateProfile, updateEmail, updatePassword } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [avatar, setAvatar] = useState(user?.avatar || '/avatars/default.jpg')
  const [password, setPassword] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `avatars/${user.id}-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('images').upload(path, file)
    setUploading(false)

    if (error) {
      setFeedback({ type: 'error', message: error.message })
      return
    }

    const { data } = supabase.storage.from('images').getPublicUrl(path)
    setAvatar(data.publicUrl)
  }

  const saveAccount = async () => {
    setSaving(true)
    setFeedback(null)

    const profileResult = await updateProfile({ name, avatar })
    if (!profileResult.success) {
      setSaving(false)
      setFeedback({ type: 'error', message: profileResult.error || 'Nao foi possivel salvar perfil.' })
      return
    }

    if (email.trim() && email.trim().toLowerCase() !== user.email.toLowerCase()) {
      const emailResult = await updateEmail(email)
      if (!emailResult.success) {
        setSaving(false)
        setFeedback({ type: 'error', message: emailResult.error || 'Nao foi possivel alterar email.' })
        return
      }
    }

    if (password) {
      const passwordResult = await updatePassword(password)
      if (!passwordResult.success) {
        setSaving(false)
        setFeedback({ type: 'error', message: passwordResult.error || 'Nao foi possivel alterar senha.' })
        return
      }
      setPassword('')
    }

    setSaving(false)
    setFeedback({ type: 'success', message: 'Conta atualizada com sucesso.' })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <User className="w-10 h-10 text-neon-pink mx-auto mb-3" />
        <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wide">MINHA CONTA</h1>
        <p className="text-text-muted text-sm mt-2">Gerencie seus dados, seguranca e feedbacks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5">
        <div className="review-card rounded-2xl p-6 h-fit text-center">
          <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border border-neon-pink/30 bg-void-lighter">
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          </div>
          <label className="mt-4 inline-flex items-center gap-2 cursor-pointer text-neon-pink hover:text-hot-pink text-sm">
            <Upload className="w-4 h-4" />
            {uploading ? 'Enviando...' : 'Alterar icone'}
            <input type="file" accept="image/*" className="hidden" onChange={uploadAvatar} />
          </label>
          <p className="text-text-main font-heading font-bold mt-4">{user.name}</p>
          <p className="text-text-dim text-sm">{user.email}</p>
        </div>

        <div className="review-card rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-2">Nome de usuario</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
                <input value={name} onChange={event => setName(event.target.value)}
                  className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-3 pl-10 text-text-main focus:outline-none focus:border-neon-pink/50" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
                <input type="email" value={email} onChange={event => setEmail(event.target.value)}
                  className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-3 pl-10 text-text-main focus:outline-none focus:border-neon-pink/50" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-text-main tracking-wider mb-2">Nova senha</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
              <input type="password" value={password} onChange={event => setPassword(event.target.value)}
                placeholder="Deixe em branco para manter a senha atual"
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-3 pl-10 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50" />
            </div>
          </div>

          {feedback && (
            <div className={`rounded-lg px-4 py-3 text-sm ${feedback.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
              {feedback.message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={saveAccount} disabled={saving} className="bg-neon-pink hover:bg-hot-pink disabled:opacity-50 text-white px-5 py-3 rounded-lg font-heading font-bold text-sm tracking-wider transition-all flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'SALVANDO...' : 'SALVAR ALTERACOES'}
            </button>
            <Link to="/feedback" className="border border-neon-pink/30 text-neon-pink hover:bg-neon-pink/10 px-5 py-3 rounded-lg font-heading font-bold text-sm tracking-wider transition-all flex items-center justify-center gap-2">
              <Heart className="w-4 h-4" />
              DAR FEEDBACK
            </Link>
            <Link to="/meus-pedidos" className="border border-neon-pink/30 text-neon-pink hover:bg-neon-pink/10 px-5 py-3 rounded-lg font-heading font-bold text-sm tracking-wider transition-all flex items-center justify-center">
              MEUS PEDIDOS
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
