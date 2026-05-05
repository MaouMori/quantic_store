import { Shield, FileText, RefreshCw, MessageSquare } from 'lucide-react'

export default function Termos() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <FileText className="w-6 h-6 text-neon-pink" />
          <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wide">
            TERMOS E CONDICOES
          </h1>
          <FileText className="w-6 h-6 text-neon-pink" />
        </div>
        <p className="text-text-muted max-w-2xl mx-auto">
          Leia atentamente nossos termos antes de realizar uma compra.
        </p>
      </div>

      <div className="space-y-6">
        {[
          {
            icon: FileText,
            title: '1. Sobre os Produtos',
            content:
              'Todos os produtos vendidos na Quantic Store sao criados exclusivamente para uso no FiveM. Os arquivos sao digitais e nao incluem itens fisicos. Ao comprar, voce adquire uma licenca de uso pessoal e nao pode revender ou distribuir os arquivos.',
          },
          {
            icon: RefreshCw,
            title: '2. Entrega e Acesso',
            content:
              'A entrega e realizada automaticamente via Discord apos a confirmacao do pagamento. Certifique-se de fornecer seu Discord tag correto durante a compra. O acesso aos arquivos e permanente, desde que respeite os termos de uso.',
          },
          {
            icon: Shield,
            title: '3. Politica de Reembolso',
            content:
              'Por se tratarem de produtos digitais, nao realizamos reembolsos apos a entrega do arquivo. Em casos excepcionais onde o arquivo apresentar defeitos, entraremos em contato para resolver a situacao da melhor forma possivel.',
          },
          {
            icon: MessageSquare,
            title: '4. Suporte',
            content:
              'Nosso suporte e realizado exclusivamente via Discord. O tempo de resposta pode variar entre algumas horas ate 24h em dias uteis. Para duvidas rapidas, consulte nossa secao de Perguntas Frequentes.',
          },
        ].map((section, i) => (
          <div key={i} className="review-card rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center">
                <section.icon className="w-5 h-5 text-neon-pink" />
              </div>
              <h2 className="font-heading font-bold text-lg text-text-main">
                {section.title}
              </h2>
            </div>
            <p className="text-text-muted leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
