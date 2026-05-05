import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, Sparkles } from 'lucide-react'
import { useAdmin } from '../context/useAdmin'
import { useCart } from '../context/useCart'

const getFinalPrice = (price: number, discountPercent = 0) => {
  const safeDiscount = Math.min(100, Math.max(0, discountPercent))
  return Number((price * (1 - safeDiscount / 100)).toFixed(2))
}

export default function BestSellers() {
  const { products } = useAdmin()
  const [startIndex, setStartIndex] = useState(0)
  const [liked, setLiked] = useState<Set<number>>(new Set())
  const { addItem } = useCart()
  const trackRef = useRef<HTMLDivElement>(null)

  const bestsellers = products.filter(p => p.isBestseller)
  const visibleCount = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 5 : window.innerWidth >= 640 ? 3 : 2
  const maxIndex = Math.max(0, bestsellers.length - visibleCount)

  const next = () => setStartIndex(prev => Math.min(prev + 1, maxIndex))
  const prev = () => setStartIndex(prev => Math.max(prev - 1, 0))

  const toggleLike = (id: number) => {
    setLiked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  useEffect(() => {
    if (trackRef.current) {
      const cardWidth = trackRef.current.children[0]?.getBoundingClientRect().width || 0
      trackRef.current.style.transform = `translateX(-${startIndex * (cardWidth + 16)}px)`
    }
  }, [startIndex])

  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-neon-pink" />
            <h2 className="font-display text-2xl sm:text-3xl text-white tracking-wide">
              MAIS VENDIDOS
            </h2>
            <Sparkles className="w-5 h-5 text-neon-pink" />
          </div>
          <button className="text-sm text-text-muted hover:text-neon-pink transition-colors flex items-center gap-1 font-heading">
            VER TODOS
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {bestsellers.length === 0 ? (
          <p className="text-text-dim text-sm">Nenhum produto marcado como mais vendido no painel.</p>
        ) : (
        <div className="relative">
          <button
            onClick={prev}
            disabled={startIndex === 0}
            className="absolute -left-2 lg:-left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-void border border-neon-pink/20 text-text-muted hover:text-neon-pink disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="overflow-hidden mx-6">
            <div
              ref={trackRef}
              className="carousel-track gap-4"
            >
              {bestsellers.map(product => {
                const finalPrice = getFinalPrice(product.price, product.discountPercent)
                const discountPercent = Math.min(100, Math.max(0, product.discountPercent || 0))
                return (
                <div
                  key={product.id}
                  className="product-card flex-shrink-0 w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(20%-13px)] rounded-xl overflow-hidden group"
                >
                  {/* Image */}
                  <Link to={`/produto/${product.id}`} className="block">
                    <div className="relative aspect-[3/4] bg-void-lighter overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement!
                          parent.innerHTML = `
                            <div class="w-full h-full flex flex-col items-center justify-center text-center p-4">
                              <div class="w-16 h-16 rounded-full bg-neon-pink/10 flex items-center justify-center mb-2">
                                <span class="text-2xl">💇‍♀️</span>
                              </div>
                              <p class="text-text-dim text-xs font-mono">/public/products/${product.id}.jpg</p>
                            </div>
                          `
                        }}
                      />

                      {product.isNew && (
                        <span className="absolute top-2 left-2 bg-neon-pink text-white text-[10px] font-bold px-2 py-0.5 rounded font-heading tracking-wider">
                          NOVO
                        </span>
                      )}

                      {discountPercent > 0 && (
                        <span className="absolute bottom-2 left-2 bg-void/80 text-neon-pink border border-neon-pink/30 text-[10px] font-bold px-2 py-0.5 rounded">
                          -{discountPercent}%
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleLike(product.id)
                        }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-void/60 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-void"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            liked.has(product.id)
                              ? 'text-neon-pink fill-neon-pink'
                              : 'text-text-muted hover:text-neon-pink'
                          }`}
                        />
                      </button>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-3">
                    <Link to={`/produto/${product.id}`}>
                      <h3 className="font-heading font-bold text-sm text-text-main truncate hover:text-neon-pink transition-colors">
                        {product.name.toUpperCase()}
                      </h3>
                    </Link>
                    <p className="text-neon-pink font-bold text-sm mt-1">
                      R$ {finalPrice.toFixed(2).replace('.', ',')}
                    </p>
                    {discountPercent > 0 && (
                      <p className="text-text-dim text-[10px] line-through">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </p>
                    )}
                    <button
                      onClick={() =>
                        addItem({
                          id: product.id,
                          name: product.name,
                          price: finalPrice,
                          image: product.image,
                        })
                      }
                      className="w-full mt-2 flex items-center justify-center gap-2 border border-neon-pink/30 text-neon-pink hover:bg-neon-pink hover:text-white text-xs font-heading font-bold py-2 rounded-lg transition-all"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      COMPRAR
                    </button>
                  </div>
                </div>
                )
              })}
            </div>
          </div>

          <button
            onClick={next}
            disabled={startIndex >= maxIndex}
            className="absolute -right-2 lg:-right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-void border border-neon-pink/20 text-text-muted hover:text-neon-pink disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        )}
      </div>
    </section>
  )
}
