import { Diamond, Zap, Lock, Star, Headphones } from 'lucide-react'

const features = [
  {
    icon: Diamond,
    title: 'EXCLUSIVIDADE',
    description: 'Pecas unicas criadas com muito estilo.',
  },
  {
    icon: Zap,
    title: 'ENVIO VIA DISCORD',
    description: 'Entrega rapida e segura direto no seu Discord.',
  },
  {
    icon: Lock,
    title: 'COMPRA SEGURA',
    description: 'Seus dados protegidos do inicio ao fim.',
  },
  {
    icon: Star,
    title: 'ATUALIZACOES',
    description: 'Novos lancamentos toda semana.',
  },
  {
    icon: Headphones,
    title: 'ATENDIMENTO',
    description: 'Suporte humanizado via Discord.',
  },
]

export default function FeaturesBar() {
  return (
    <section className="border-y border-neon-pink/10 bg-void-light/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 py-6 lg:py-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-3 group"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center group-hover:bg-neon-pink/20 transition-colors">
                <feature.icon className="w-5 h-5 text-neon-pink feature-icon" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-heading font-bold text-text-main tracking-wider">
                  {feature.title}
                </h3>
                <p className="text-[11px] text-text-dim mt-0.5 leading-tight">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
