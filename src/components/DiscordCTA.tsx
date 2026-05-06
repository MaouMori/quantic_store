import { MessageCircle, Mail } from 'lucide-react'
import { useDiscordUrl } from '../lib/siteConfig'

export default function DiscordCTA() {
  const discordUrl = useDiscordUrl()

  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden border border-neon-pink/20 bg-gradient-to-r from-void-light via-void-lighter to-void-light">
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 w-8 h-8 border border-neon-pink/20 rounded-lg rotate-12" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border border-neon-purple/20 rounded-full" />
          <div className="absolute top-1/2 right-10 w-4 h-4 bg-neon-pink/10 rounded-full animate-pulse" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 p-8 lg:p-12">
            {/* Left - Icon */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center animate-float">
                <Mail className="w-10 h-10 lg:w-12 lg:h-12 text-neon-pink" />
              </div>
            </div>

            {/* Center - Text */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white tracking-wide mb-2">
                FACA PARTE DO NOSSO MUNDO!
              </h2>
              <p className="text-text-muted text-sm sm:text-base">
                Receba novidades, lancamentos e ofertas exclusivas no nosso Discord.
              </p>
            </div>

            {/* Right - Button */}
            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-3 rounded-xl font-heading font-bold text-sm tracking-wider transition-all btn-shine"
            >
                <MessageCircle className="w-5 h-5" />
                ENTRAR NO DISCORD
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
