import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { collections } from '../data/storeData'
import { useAdmin } from '../context/useAdmin'

export default function Colecoes() {
  const { banners } = useAdmin()
  const pageBanners = banners.filter(banner => banner.active && banner.position === 'colecoes')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-neon-pink" />
          <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wide">
            NOSSAS COLECOES
          </h1>
          <Sparkles className="w-6 h-6 text-neon-pink" />
        </div>
        <p className="text-text-muted max-w-2xl mx-auto">
          Cada colecao foi criada para expressar uma vibe unica. Escolha a sua e brilhe no FiveM.
        </p>
      </div>

      {pageBanners.length > 0 && (
        <div className="grid grid-cols-1 gap-4 mb-8">
          {pageBanners.map(banner => (
            <Link key={banner.id} to={banner.link || '/colecoes'} className="block rounded-xl overflow-hidden border border-neon-pink/10 bg-void-lighter">
              <img src={banner.image} alt={banner.title} className="w-full max-h-72 object-cover" />
              <div className="p-4">
                <h2 className="font-heading font-bold text-text-main">{banner.title}</h2>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {collections.map(collection => (
          <div
            key={collection.id}
            className="collection-card rounded-2xl overflow-hidden cursor-pointer group border"
            style={{
              borderColor: collection.color + '20',
            }}
          >
            <div className="relative aspect-[16/10]">
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
                      <div class="w-24 h-24 rounded-full flex items-center justify-center mb-4" style="background: ${collection.color}20">
                        <span class="text-4xl">✨</span>
                      </div>
                      <p class="text-text-dim text-sm font-mono">/public/collections/${collection.id}.jpg</p>
                    </div>
                  `
                }}
              />

              <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
                <h2
                  className="font-display text-4xl sm:text-5xl tracking-wide"
                  style={{ color: collection.color }}
                >
                  {collection.name}
                </h2>
                <p className="text-text-muted text-base mt-2 max-w-md">
                  {collection.subtitle}
                </p>
              </div>

              <div
                className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 z-10 opacity-60"
                style={{ borderColor: collection.color }}
              />
              <div
                className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 z-10 opacity-60"
                style={{ borderColor: collection.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
