export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' })
    return
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) {
    response.status(200).json({ skipped: true, reason: 'DISCORD_WEBHOOK_URL not configured' })
    return
  }

  const order = request.body || {}
  const items = Array.isArray(order.items) ? order.items : []
  const total = Number(order.total || 0)

  const content = [
    '**Novo pedido na Quantic Store**',
    `Pedido: ${order.id || 'sem id'}`,
    `Cliente: ${order.customer || 'nao informado'}`,
    `Email: ${order.email || 'nao informado'}`,
    `Discord: ${order.discord || 'nao informado'}`,
    `Total: R$ ${total.toFixed(2).replace('.', ',')}`,
    order.couponCode ? `Cupom: ${order.couponCode}` : null,
    '',
    '**Itens**',
    ...items.map(item => `- ${item.name} x${item.quantity} - R$ ${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2).replace('.', ',')}`),
  ].filter(Boolean).join('\n')

  const discordResponse = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })

  if (!discordResponse.ok) {
    response.status(200).json({ notified: false, status: discordResponse.status })
    return
  }

  response.status(200).json({ notified: true })
}
