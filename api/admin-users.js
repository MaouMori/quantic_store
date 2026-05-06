import { createClient } from '@supabase/supabase-js'

const normalizeEmail = (email = '') =>
  email.normalize('NFKC').replace(/[\s\u200B-\u200D\uFEFF]/g, '').trim().toLowerCase()

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' })
    return
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    response.status(500).json({ error: 'Configure SUPABASE_SERVICE_ROLE_KEY no Vercel para criar usuarios pelo painel.' })
    return
  }

  const { name, email, password, role } = request.body || {}
  const normalizedEmail = normalizeEmail(email)

  if (!name?.trim() || !normalizedEmail || !password || password.length < 6) {
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
    user_metadata: { name: name.trim() },
  })

  if (error) {
    response.status(400).json({ error: error.message })
    return
  }

  const userId = data.user?.id
  if (!userId) {
    response.status(500).json({ error: 'Usuario criado sem id retornado.' })
    return
  }

  const profile = await admin.from('profiles').upsert({
    id: userId,
    name: name.trim(),
    email: normalizedEmail,
    role: role === 'Administrador' ? 'Administrador' : 'Cliente',
    role_color: role === 'Administrador' ? '#ff2d95' : '#9a8fb0',
    permissions: role === 'Administrador' ? ['*'] : [],
  }, { onConflict: 'id' })

  if (profile.error) {
    response.status(400).json({ error: profile.error.message })
    return
  }

  response.status(200).json({ id: userId })
}
