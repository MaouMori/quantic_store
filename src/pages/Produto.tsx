import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ShoppingCart,
  Heart,
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
  Package,
  Truck,
  Shield,
} from 'lucide-react'
import { getProductById, getRelatedProducts } from '../data/storeData'
import { useCart } from '../context/useCart'

export default function Produto() {
  const { id } = useParams<{ id: string }>()
  const product = getProductById(Number(id))
  const { addItem } = useCart()

  const [selectedImage, setSelectedImage] = useState(0)
  const [liked, setLiked] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'descricao' | 'ingame'>('descricao')

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-text-muted text-lg">Produto nao encontrado.</p>
        <Link
          to="/loja"
          className="inline-flex items-center gap-2 text-neon-pink mt-4 hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const related = getRelatedProducts(product)
  const allImages = [...product.images, ...(product.inGameImages || [])]

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-dim mb-6">
        <Link to="/" className="hover:text-neon-pink transition-colors">Home</Link>
        <span>/</span>
        <Link to="/loja" className="hover:text-neon-pink transition-colors">Loja</Link>
        <span>/</span>
        <span className="text-text-main">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-neon-pink/10 bg-void-lighter">
            <img
              src={allImages[selectedImage] || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                target.parentElement!.innerHTML = `
                  <div class="w-full h-full flex flex-col items-center justify-center text-center p-8">
                    <div class="w-24 h-24 rounded-full bg-neon-pink/10 flex items-center justify-center mb-4">
                      <span class="text-4xl">✨</span>
                    </div>
                    <p class="text-text-dim text-sm font-mono">${allImages[selectedImage] || product.image}</p>
                  </div>
                `
              }}
            />

            {product.isNew && (
              <span className="absolute top-4 left-4 bg-neon-pink text-white text-xs font-bold px-3 py-1 rounded-lg font-heading tracking-wider">
                NOVO
              </span>
            )}

            <button
              onClick={() => setLiked(!liked)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-void/60 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-void"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  liked ? 'text-neon-pink fill-neon-pink' : 'text-text-muted hover:text-neon-pink'
                }`}
              />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImage === i
                    ? 'border-neon-pink'
                    : 'border-transparent hover:border-neon-pink/30'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} - ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center bg-void-lighter">
                        <span class="text-lg">✨</span>
                      </div>
                    `
                  }}
                />
                {i >= product.images.length && (
                  <span className="absolute bottom-1 right-1 text-[8px] bg-neon-purple text-white px-1 rounded font-bold">
                    IN-GAME
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-text-main">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="w-4 h-4 text-star fill-star" />
                ))}
              </div>
              <span className="text-text-dim text-sm">4.9 (127 avaliacoes)</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-neon-pink">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-text-dim text-sm line-through">
              R$ {(product.price * 1.2).toFixed(2).replace('.', ',')}
            </span>
            <span className="bg-neon-pink/10 text-neon-pink text-xs font-bold px-2 py-0.5 rounded">
              -20%
            </span>
          </div>

          {/* Tabs */}
          <div className="border-b border-neon-pink/10">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab('descricao')}
                className={`pb-3 text-sm font-heading font-bold tracking-wider transition-colors relative ${
                  activeTab === 'descricao'
                    ? 'text-neon-pink'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                DESCRICAO
                {activeTab === 'descricao' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-pink" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('ingame')}
                className={`pb-3 text-sm font-heading font-bold tracking-wider transition-colors relative ${
                  activeTab === 'ingame'
                    ? 'text-neon-pink'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                NO JOGO
                {activeTab === 'ingame' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-pink" />
                )}
              </button>
            </div>
          </div>

          {activeTab === 'descricao' ? (
            <div className="space-y-4">
              <p className="text-text-muted leading-relaxed">{product.description}</p>

              {product.specs && (
                <div className="space-y-2">
                  <h4 className="font-heading font-bold text-sm text-text-main">Especificacoes:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.specs.map((spec, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-text-muted"
                      >
                        <Check className="w-4 h-4 text-neon-pink flex-shrink-0" />
                        <span>
                          <strong className="text-text-main">{spec.label}:</strong>{' '}
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-text-muted">
                Veja como esse item fica dentro do jogo:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(product.inGameImages || []).map((img, i) => (
                  <div
                    key={i}
                    className="aspect-video rounded-xl overflow-hidden border border-neon-pink/10 bg-void-lighter"
                  >
                    <img
                      src={img}
                      alt={`${product.name} in-game ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.parentElement!.innerHTML = `
                          <div class="w-full h-full flex flex-col items-center justify-center text-center p-4">
                            <div class="w-12 h-12 rounded-full bg-neon-purple/10 flex items-center justify-center mb-2">
                              <span class="text-xl">🎮</span>
                            </div>
                            <p class="text-text-dim text-[10px] font-mono">${img}</p>
                          </div>
                        `
                      }}
                    />
                  </div>
                ))}
                {(!product.inGameImages || product.inGameImages.length === 0) && (
                  <div className="col-span-2 text-center py-8 text-text-dim">
                    <span className="text-3xl">🎮</span>
                    <p className="mt-2">Imagens in-game em breve!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg bg-void-lighter border border-neon-pink/20 flex items-center justify-center text-text-muted hover:text-neon-pink transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-mono text-text-main">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg bg-void-lighter border border-neon-pink/20 flex items-center justify-center text-text-muted hover:text-neon-pink transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-neon-pink hover:bg-hot-pink text-white py-3 rounded-xl font-heading font-bold tracking-wider transition-all btn-shine flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              ADICIONAR AO CARRINHO
            </button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-3 pt-4">
            {[
              { icon: Truck, label: 'Entrega via Discord' },
              { icon: Shield, label: 'Compra segura' },
              { icon: Package, label: 'Arquivos prontos' },
            ].map(benefit => (
              <div
                key={benefit.label}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-void-lighter/50 border border-neon-pink/5 text-center"
              >
                <benefit.icon className="w-5 h-5 text-neon-pink" />
                <span className="text-text-dim text-[10px] leading-tight">{benefit.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl text-white tracking-wide mb-6">
            VOCE TAMBEM PODE GOSTAR
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map(p => (
              <Link
                key={p.id}
                to={`/produto/${p.id}`}
                className="product-card rounded-xl overflow-hidden group"
              >
                <div className="relative aspect-square bg-void-lighter overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center">
                          <span class="text-2xl">✨</span>
                        </div>
                      `
                    }}
                  />
                  {p.isNew && (
                    <span className="absolute top-2 left-2 bg-neon-pink text-white text-[10px] font-bold px-2 py-0.5 rounded">NOVO</span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-heading font-bold text-sm text-text-main truncate">{p.name}</h3>
                  <p className="text-neon-pink font-bold text-sm mt-1">
                    R$ {p.price.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
