import { ChevronRight, Sparkles } from 'lucide-react'
import { collections } from '../data/storeData'

export default function Collections() {
  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-neon-pink" />
            <h2 className="font-display text-2xl sm:text-3xl text-white tracking-wide">
              ESCOLHA SUA VIBE
            </h2>
            <Sparkles className="w-5 h-5 text-neon-pink" />
          </div>
          <button className="text-sm text-text-muted hover:text-neon-pink transition-colors flex items-center gap-1 font-heading">
            VER TODAS AS COLECOES
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {collections.map(collection => (
            <div
              key={collection.id}
              className="collection-card rounded-xl overflow-hidden cursor-pointer group"
              style={{
                borderColor: collection.color + '30',
                borderWidth: '1px',
              }}
            >
              <div className="relative aspect-[4/5]">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement!
                    parent.innerHTML = `
                      <div class="w-full h-full flex flex-col items-center justify-center" style="background: linear-gradient(145deg, ${collection.color}15, ${collection.color}05)">
                        <div class="w-20 h-20 rounded-full flex items-center justify-center mb-3" style="background: ${collection.color}20">
                          <span class="text-3xl">✨</span>
                        </div>
                        <p class="text-text-dim text-xs font-mono text-center px-4">/public/collections/${collection.id}.jpg</p>
                      </div>
                    `
                  }}
                />

                {/* Overlay content */}
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-4">
                  <div className="relative">
                    <h3
                      className="font-display text-2xl sm:text-3xl tracking-wide"
                      style={{ color: collection.color }}
                    >
                      {collection.name.split(' ')[0]}
                    </h3>
                    <h3
                      className="font-display text-2xl sm:text-3xl tracking-wide -mt-1"
                      style={{ color: collection.color }}
                    >
                      {collection.name.split(' ')[1] || ''}
                    </h3>
                    <p className="text-text-muted text-xs mt-2 leading-relaxed">
                      {collection.subtitle}
                    </p>
                  </div>
                </div>

                {/* Corner brackets */}
                <div
                  className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 z-10 opacity-60"
                  style={{ borderColor: collection.color }}
                />
                <div
                  className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 z-10 opacity-60"
                  style={{ borderColor: collection.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
