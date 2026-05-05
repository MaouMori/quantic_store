import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Zap, Shield, Lock, Diamond } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-neon-pink/10">
      {/* Features bar */}
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
                desc: 'Ambiente 100% seguro. Seus dados protegidos.',
              },
              {
                icon: Diamond,
                title: 'PRODUTOS EXCLUSIVOS',
                desc: 'Tudo feito com muito carinho e criatividade para voce.',
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

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-display text-2xl text-neon-pink tracking-wider">QUANTIC</span>
              <Heart className="w-4 h-4 text-neon-pink fill-neon-pink" />
            </div>
            <p className="text-text-dim text-xs leading-relaxed">
              Estilo, atitude e autenticidade em cada detalhe.
            </p>
            <div className="flex gap-2 mt-3">
              {['💀', '💖', '⚡'].map((emoji, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-full bg-void-lighter border border-neon-pink/10 flex items-center justify-center text-text-dim hover:text-neon-pink hover:border-neon-pink/30 transition-all"
                >
                  <span className="text-sm">{emoji}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links Rapidos */}
          <div>
            <h3 className="font-heading font-bold text-xs text-text-main tracking-wider mb-3">LINKS RAPIDOS</h3>
            <ul className="space-y-1.5">
              {[
                { path: '/', label: 'Home' },
                { path: '/loja', label: 'Loja' },
                { path: '/colecoes', label: 'Colecoes' },
                { path: '/sobre', label: 'Sobre' },
                { path: '/termos', label: 'Termos' },
              ].map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-text-dim text-xs hover:text-neon-pink transition-colors flex items-center gap-1"
                  >
                    <span className="text-neon-pink/50">•</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ajuda */}
          <div>
            <h3 className="font-heading font-bold text-xs text-text-main tracking-wider mb-3">AJUDA</h3>
            <ul className="space-y-1.5">
              {[
                'Perguntas Frequentes',
                'Como comprar',
                'Trocas e Devolucoes',
                'Fale Conosco (Discord)',
              ].map(item => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-text-dim text-xs hover:text-neon-pink transition-colors flex items-center gap-1"
                  >
                    <span className="text-neon-pink/50">•</span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Pagamentos */}
          <div>
            <h3 className="font-heading font-bold text-xs text-text-main tracking-wider mb-3">PAGAMENTOS</h3>
            <div className="flex flex-wrap gap-1.5">
              {['Pix', 'Cartao de Credito', 'VISA', 'Mastercard', 'elo'].map(p => (
                <span
                  key={p}
                  className="px-2 py-1 rounded bg-void-lighter border border-neon-pink/10 text-text-muted text-[10px] font-mono"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Seguranca */}
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

        {/* Bottom */}
        <div className="mt-10 pt-5 border-t border-neon-pink/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-text-dim text-[11px]">
            © 2024 Quantic Store. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-1.5">
            <Heart className="w-3 h-3 text-neon-pink fill-neon-pink" />
            <span className="text-text-dim text-[11px]">Feito com amor</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
