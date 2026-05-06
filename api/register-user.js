import { createClient } from '@supabase/supabase-js'

const normalizeEmail = (email = '') =>
  email.normalize('NFKC').replace(/[\s\u200B-\u200D\uFEFF]/g, '').trim().toLowerCase()

const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const getPublicError = message => {
  const normalized = String(message || '').toLowerCase()

  if (normalized.includes('already registered') || normalized.includes('already been registered')) {
    return 'Este email ja esta cadastrado. Use entrar ou recupere a senha.'
  }

  if (normalized.includes('invalid')) {
    return 'Esse email foi recusado pelo Supabase. Tente um email real diferente.'
  }

  return message || 'Nao foi possivel criar a conta.'
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' })
    return
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    response.status(500).json({ error: 'Cadastro pelo servidor indisponivel. Configure SUPABASE_SERVICE_ROLE_KEY no Vercel.' })
    return
  }

  const { name, email, password } = request.body || {}
  const normalizedName = String(name || '').trim()
  const normalizedEmail = normalizeEmail(email)

  if (!normalizedName || !isValidEmail(normalizedEmail) || !password || password.length < 6) {
    response.status(400).json({ error: 'Informe nome, email valido e senha com pelo menos 6 caracteres.' })
    return
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data, error } = await admin.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
    user_metadata: { name: normalizedName },
  })

  if (error) {
    response.status(400).json({ error: getPublicError(error.message) })
    return
  }

  const userId = data.user?.id
  if (!userId) {
    response.status(500).json({ error: 'Usuario criado sem id retornado.' })
    return
  }

  const profile = await admin.from('profiles').upsert({
    id: userId,
    name: normalizedName,
    email: normalizedEmail,
    avatar: '/avatars/default.jpg',
    role: 'Cliente',
    role_color: '#9a8fb0',
    permissions: [],
  }, { onConflict: 'id' })

  if (profile.error) {
    response.status(400).json({ error: profile.error.message })
    return
  }

  response.status(200).json({ id: userId })
}
