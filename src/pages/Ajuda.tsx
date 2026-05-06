import { Link } from 'react-router-dom'
import { ChevronRight, HelpCircle, MessageCircle, Sparkles } from 'lucide-react'
import { useDiscordUrl, useHelpTopics } from '../lib/siteConfig'

export default function Ajuda() {
  const discordUrl = useDiscordUrl()
  const { topics, loading } = useHelpTopics()
  const visibleTopics = topics.filter(topic => topic.active)

  return (
    <div>
      <section className="border-b border-neon-pink/10 bg-void-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center gap-2 text-sm text-text-dim mb-8">
            <Link to="/" className="hover:text-neon-pink transition-colors">Inicio</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-main">Ajuda</span>
          </nav>
          <div className="max-w-2xl">
            <p className="font-heading font-bold text-neon-pink tracking-wider mb-3">CENTRAL DE AJUDA</p>
            <h1 className="font-display text-5xl sm:text-6xl text-text-main tracking-wide">Como podemos ajudar?</h1>
            <p className="text-text-muted mt-4 leading-relaxed">
              Tire suas duvidas sobre compra, pagamento, entrega e suporte da Quantic Store.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <aside className="review-card rounded-xl p-5 h-fit">
            <h2 className="font-heading font-bold text-text-main mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-neon-pink" />
              Topicos
            </h2>
            <div className="space-y-2">
              {visibleTopics.map(topic => (
                <a key={topic.id} href={`#${topic.id}`} className="block rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-neon-pink/10 hover:text-neon-pink transition-colors">
                  {topic.title}
                </a>
              ))}
            </div>
          </aside>

          <div className="space-y-4">
            {loading && <p className="text-text-dim text-sm">Carregando ajuda...</p>}
            {visibleTopics.map(topic => (
              <article key={topic.id} id={topic.id} className="review-card rounded-xl p-6 scroll-mt-28">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-neon-pink" />
                  <h2 className="font-heading font-bold text-xl text-text-main">{topic.title}</h2>
                </div>
                <p className="text-text-muted leading-relaxed whitespace-pre-line">{topic.answer}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="review-card rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-bold text-text-main">Ainda precisa de ajuda?</h2>
            <p className="text-text-muted text-sm mt-1">Entre no Discord oficial e fale com o suporte.</p>
          </div>
          <a href={discordUrl} target="_blank" rel="noreferrer" className="bg-neon-pink hover:bg-hot-pink text-white px-5 py-3 rounded-lg font-heading font-bold text-sm tracking-wider transition-all flex items-center justify-center gap-2">
            ENTRAR NO DISCORD
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  )
}
