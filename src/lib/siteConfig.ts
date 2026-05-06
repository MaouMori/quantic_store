import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'

export const DEFAULT_DISCORD_URL = 'https://discord.gg/quanticstore'

export const DEFAULT_HELP_TOPICS = [
  {
    id: 'faq',
    title: 'Perguntas Frequentes',
    answer: 'Aqui voce encontra respostas para as principais duvidas sobre produtos, pedidos, entrega e suporte.',
    sortOrder: 1,
    active: true,
  },
  {
    id: 'como-comprar',
    title: 'Como comprar',
    answer: 'Escolha os produtos, finalize o pedido pelo Pix, envie o comprovante e informe seu Discord para receber os arquivos.',
    sortOrder: 2,
    active: true,
  },
  {
    id: 'trocas-devolucoes',
    title: 'Trocas e Devolucoes',
    answer: 'Como os produtos sao digitais, trocas e ajustes sao avaliados pelo suporte quando houver problema no arquivo entregue.',
    sortOrder: 3,
    active: true,
  },
  {
    id: 'fale-conosco',
    title: 'Fale Conosco',
    answer: 'O atendimento acontece pelo Discord oficial da loja. Entre no servidor e abra um chamado para falar com a equipe.',
    sortOrder: 4,
    active: true,
  },
]

export type HelpTopic = {
  id: string
  title: string
  answer: string
  sortOrder: number
  active: boolean
}

export const slugifyHelpTitle = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export function useDiscordUrl() {
  const [discordUrl, setDiscordUrl] = useState(DEFAULT_DISCORD_URL)

  useEffect(() => {
    let mounted = true
    void (async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'discord_url')
        .maybeSingle<{ value: string }>()
      if (mounted && data?.value) setDiscordUrl(data.value)
    })()
    return () => {
      mounted = false
    }
  }, [])

  return discordUrl
}

export function useHelpTopics() {
  const [topics, setTopics] = useState<HelpTopic[]>(DEFAULT_HELP_TOPICS)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('help_topics')
      .select('id,title,answer,sort_order,active')
      .order('sort_order', { ascending: true })

    if (!error && data && data.length > 0) {
      setTopics(data.map(topic => ({
        id: topic.id,
        title: topic.title,
        answer: topic.answer,
        sortOrder: topic.sort_order,
        active: topic.active,
      })))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refresh()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [refresh])

  return { topics, loading, refresh }
}
