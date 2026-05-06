import { Heart, Star, Users, Package, Clock } from 'lucide-react'

export default function Sobre() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-6 h-6 text-neon-pink fill-neon-pink" />
          <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wide">
            SOBRE A QUANTIC
          </h1>
          <Heart className="w-6 h-6 text-neon-pink fill-neon-pink" />
        </div>
        <p className="text-text-muted max-w-2xl mx-auto">
          Criando estilo e atitude para o universo FiveM.
        </p>
      </div>

      <div className="space-y-8">
        <div className="review-card rounded-2xl p-6 sm:p-8">
          <h2 className="font-heading font-bold text-xl text-text-main mb-4">
            Nossa Historia
          </h2>
          <p className="text-text-muted leading-relaxed">
            A Quantic Store nasceu da paixao por moda e jogos. Somos uma equipe de criadores
            dedicados a trazer os melhores cabelos, roupas e acessorios para o FiveM. Cada peca
            e criada com atencao aos detalhes para garantir que voce se destaque no servidor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Users, label: 'Clientes', value: '500+' },
            { icon: Package, label: 'Produtos', value: '50+' },
            { icon: Clock, label: 'Entrega', value: 'Instantanea' },
          ].map(stat => (
            <div
              key={stat.label}
              className="review-card rounded-xl p-6 text-center"
            >
              <stat.icon className="w-8 h-8 text-neon-pink mx-auto mb-3" />
              <p className="font-display text-3xl text-white">{stat.value}</p>
              <p className="text-text-dim text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="review-card rounded-2xl p-6 sm:p-8">
          <h2 className="font-heading font-bold text-xl text-text-main mb-4">
            Por que escolher a Quantic?
          </h2>
          <ul className="space-y-3">
            {[
              'Pecas exclusivas e originais',
              'Entrega automatica via Discord',
              'Suporte humanizado e atencioso',
              'Atualizacoes semanais com novidades',
              'Precos justos e acessiveis',
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-text-muted">
                <Star className="w-4 h-4 text-neon-pink fill-neon-pink flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
