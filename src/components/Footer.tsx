import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Zap, Shield, Lock, Diamond } from 'lucide-react'
import { useHelpTopics } from '../lib/siteConfig'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { topics } = useHelpTopics()
  const helpLinks = topics.filter(topic => topic.active).slice(0, 4)

  return (
    <footer className="border-t border-neon-pink/10">
      <div className="border-b border-neon-pink/10 bg-void-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: MessageCircle,
                title: 'ENTREGA VIA DISCORD',
                desc: 'Todos os pedidos sao entregues diretamente no seu Discord.',
              },
              {
                icon: Zap,
                title: 'ATENDIMENTO RAPIDO',
                desc: 'Suporte humanizado e agil pelo nosso servidor.',
              },
              {
                icon: Lock,
                title: 'PAGAMENTO SEGURO',
                desc: 'Pagamento por Pix com comprovante e conferencia do pedido.',
              },
              {
                icon: Diamond,
                title: 'PRODUTOS EXCLUSIVOS',
                desc: 'Itens digitais criados com identidade propria para voce.',
              },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-neon-pink" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs text-text-main tracking-wider">{f.title}</h4>
                  <p className="text-text-dim text-[11px] mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-display text-2xl text-neon-pink tracking-wider">QUANTIC</span>
              <Heart className="w-4 h-4 text-neon-pink fill-neon-pink" />
            </div>
            <p className="text-text-dim text-xs leading-relaxed">
              Estilo, atitude e autenticidade em cada detalhe.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-bold text-xs text-text-main tracking-wider mb-3">LINKS RAPIDOS</h3>
            <ul className="space-y-1.5">
              {[
                { path: '/', label: 'Home' },
                { path: '/loja', label: 'Loja' },
                { path: '/colecoes', label: 'Colecoes' },
                { path: '/sobre', label: 'Sobre' },
                { path: '/ajuda', label: 'Ajuda' },
                { path: '/termos', label: 'Termos' },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-text-dim text-xs hover:text-neon-pink transition-colors flex items-center gap-1">
                    <span className="text-neon-pink/50">-</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-xs text-text-main tracking-wider mb-3">AJUDA</h3>
            <ul className="space-y-1.5">
              {helpLinks.map(item => (
                <li key={item.id}>
                  <Link to={`/ajuda#${item.id}`} className="text-text-dim text-xs hover:text-neon-pink transition-colors flex items-center gap-1">
                    <span className="text-neon-pink/50">-</span>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-xs text-text-main tracking-wider mb-3">PAGAMENTOS</h3>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-1 rounded bg-void-lighter border border-neon-pink/10 text-text-muted text-[10px] font-mono">
                Pix
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold text-xs text-text-main tracking-wider mb-3">SEGURANCA</h3>
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-neon-pink flex-shrink-0 mt-0.5" />
              <p className="text-text-dim text-[11px] leading-relaxed">
                Seus dados estao protegidos com criptografia.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-5 border-t border-neon-pink/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-text-dim text-[11px]">
            © {currentYear} Quantic Store. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-1.5">
            <Heart className="w-3 h-3 text-neon-pink fill-neon-pink" />
            <span className="text-text-dim text-[11px]">Feito por Maou</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
