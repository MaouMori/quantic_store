export const getAuthErrorMessage = (message?: string) => {
  const normalizedMessage = message?.toLowerCase() || ''

  if (normalizedMessage.includes('email rate limit exceeded') || normalizedMessage.includes('rate limit')) {
    return 'Muitas tentativas em pouco tempo. Aguarde alguns minutos antes de tentar criar conta ou reenviar email.'
  }

  if (normalizedMessage.includes('invalid login credentials')) {
    return 'Email ou senha incorretos.'
  }

  if (normalizedMessage.includes('email address') && normalizedMessage.includes('invalid')) {
    return 'Email invalido. Confira se nao ha espacos ou caracteres errados.'
  }

  if (normalizedMessage.includes('user already registered') || normalizedMessage.includes('already registered')) {
    return 'Este email ja esta cadastrado. Use entrar ou recupere a senha.'
  }

  return message || 'Erro ao conectar com o servidor.'
}
