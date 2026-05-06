import { ShoppingCart, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAdmin } from '../context/useAdmin'
import { useCart } from '../context/useCart'

const getFinalPrice = (price: number, discountPercent = 0) => {
  const safeDiscount = Math.min(100, Math.max(0, discountPercent))
  return Number((price * (1 - safeDiscount / 100)).toFixed(2))
}

export default function Colecoes() {
  const { banners, storeCollections, products } = useAdmin()
  const { addItem } = useCart()
  const pageBanners = banners.filter(banner => banner.active && banner.position === 'colecoes')
  const collections = storeCollections.filter(collection => collection.active)

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
        <div className="space-y-4 mb-8">
          {pageBanners.map(banner => (
            <div key={banner.id} className="max-w-[1320px] mx-auto aspect-[55/32] max-h-[768px] overflow-hidden bg-void">
              <img src={banner.image} alt={banner.title || 'Banner'} className="w-full h-full object-contain object-center" />
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {collections.map(collection => {
          const collectionProducts = products.filter(product =>
            product.collectionId === collection.id || collection.productIds.includes(product.id)
          )
          const finalPrice = getFinalPrice(collection.price, collection.discountPercent)
          return (
          <Link
            key={collection.id}
            to={`/colecoes/${collection.id}`}
            className="collection-card rounded-2xl overflow-hidden group border"
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
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="text-neon-pink font-heading font-bold text-xl">
                    R$ {finalPrice.toFixed(2).replace('.', ',')}
                  </span>
                  {collection.discountPercent > 0 && (
                    <>
                      <span className="text-text-dim text-sm line-through">
                        R$ {collection.price.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="bg-neon-pink/10 text-neon-pink text-xs font-bold px-2 py-0.5 rounded">
                        -{collection.discountPercent}%
                      </span>
                    </>
                  )}
                </div>
                {collectionProducts.length > 0 && (
                  <p className="text-text-dim text-xs mt-3">
                    {collectionProducts.length} produto{collectionProducts.length > 1 ? 's' : ''}: {collectionProducts.map(product => product.name).slice(0, 3).join(', ')}
                    {collectionProducts.length > 3 ? '...' : ''}
                  </p>
                )}
                <button
                  type="button"
                  onClick={event => {
                    event.preventDefault()
                    event.stopPropagation()
                    addItem({
                      id: -collection.id,
                      name: `Colecao ${collection.name}`,
                      price: finalPrice,
                      image: collection.image,
                    })
                  }}
                  className="mt-4 w-fit bg-neon-pink hover:bg-hot-pink text-white px-4 py-2 rounded-lg font-heading font-bold text-sm tracking-wider transition-all flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  COMPRAR COLECAO
                </button>
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
          </Link>
          )
        })}
      </div>
      {collections.length === 0 && (
        <p className="text-text-dim text-center text-sm">Nenhuma colecao ativa cadastrada no painel.</p>
      )}
    </div>
  )
}
