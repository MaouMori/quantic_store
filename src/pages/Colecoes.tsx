import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Box,
  Crown,
  Diamond,
  Gamepad2,
  Gift,
  Headphones,
  MessageCircle,
  Package,
  Search,
  Shirt,
  ShoppingCart,
  Skull,
  Sparkles,
  Star,
  WandSparkles,
  Zap,
} from 'lucide-react'
import { categories as defaultCategories } from '../data/storeData'
import type { Product } from '../data/storeData'
import { useAdmin } from '../context/useAdmin'
import { useCart } from '../context/useCart'

const getFinalPrice = (price: number, discountPercent = 0) => {
  const safeDiscount = Math.min(100, Math.max(0, discountPercent))
  return Number((price * (1 - safeDiscount / 100)).toFixed(2))
}

const getCreatedTime = (createdAt?: string) => createdAt ? new Date(createdAt).getTime() || 0 : 0

const categoryIcons: Record<string, typeof Package> = {
  todos: Package,
  cabelos: Headphones,
  acessorios: Star,
  roupas: Shirt,
  conjuntos: WandSparkles,
  outros: Skull,
}

export default function Colecoes() {
  const { banners, storeCollections, products, productCategories } = useAdmin()
  const { addItem } = useCart()
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [sortBy, setSortBy] = useState('recentes')
  const pageBanners = banners.filter(banner => banner.active && banner.position === 'colecoes')
  const collections = useMemo(() => {
    const activeCollections = storeCollections.filter(collection => collection.active)
    switch (sortBy) {
      case 'nome':
        return [...activeCollections].sort((a, b) => a.name.localeCompare(b.name))
      case 'produtos':
        return [...activeCollections].sort((a, b) => {
          const bCount = products.filter(product => product.collectionId === b.id || b.productIds.includes(product.id)).length
          const aCount = products.filter(product => product.collectionId === a.id || a.productIds.includes(product.id)).length
          return bCount - aCount
        })
      case 'recentes':
      default:
        return [...activeCollections].sort((a, b) => getCreatedTime(b.createdAt) - getCreatedTime(a.createdAt) || b.id - a.id)
    }
  }, [products, sortBy, storeCollections])

  const categoryOptions = [
    { value: 'todos', label: 'Todas' },
    ...(productCategories.length > 0
      ? productCategories.filter(item => item.active).map(item => ({ value: item.slug, label: item.name }))
      : defaultCategories.filter(item => item.value !== 'todos').map(item => ({ value: item.value, label: item.label }))),
  ]

  const featuredCollection = collections[0]
  const featuredProducts = useMemo(() => {
    const visibleProducts = products.filter(product => product.sellIndividually ?? true)
    const collectionProducts = featuredCollection
      ? visibleProducts.filter(product =>
          product.collectionId === featuredCollection.id || featuredCollection.productIds.includes(product.id)
        )
      : visibleProducts

    const filtered = selectedCategory === 'todos'
      ? collectionProducts
      : collectionProducts.filter(product => product.category === selectedCategory)

    return [...filtered]
      .sort((a, b) => Number(b.isNew) - Number(a.isNew) || getCreatedTime(b.createdAt) - getCreatedTime(a.createdAt) || b.id - a.id)
      .slice(0, 4)
  }, [featuredCollection, products, selectedCategory])

  return (
    <div className="overflow-hidden">
      <section className="relative border-b border-neon-pink/10 bg-void">
        {pageBanners.length > 0 ? (
          <div className="space-y-0">
            {pageBanners.map(banner => (
              <div key={banner.id} className="relative w-full max-w-[1920px] mx-auto h-[clamp(260px,56.25vw,720px)] overflow-hidden">
                <img
                  src={banner.image}
                  alt={banner.title || 'Banner de colecoes'}
                  className="w-full h-full object-contain object-center"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-neon-pink font-heading font-bold text-sm tracking-wider mb-5">
                <Sparkles className="w-4 h-4" />
                COLECOES EXCLUSIVAS
                <Sparkles className="w-4 h-4" />
              </div>
              <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-none text-white tracking-wide">
                EXPRESSE
                <span className="block text-neon-pink">SUA ESSENCIA</span>
              </h1>
              <p className="mt-6 text-text-muted text-base sm:text-lg max-w-xl leading-relaxed">
                Cada colecao foi criada para representar uma vibe unica. Escolha o seu brilho no FiveM.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8 max-w-2xl">
                {[
                  { icon: Diamond, title: 'Exclusividade', text: 'Pecas unicas para voce.' },
                  { icon: Zap, title: 'Estilo autentico', text: 'Designs feitos para marcar.' },
                  { icon: Crown, title: 'Qualidade premium', text: 'Detalhes pensados com carinho.' },
                  { icon: Gamepad2, title: 'Via Discord', text: 'Entrega direta e pratica.' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-3">
                    <item.icon className="w-7 h-7 text-neon-pink flex-shrink-0" />
                    <div>
                      <h3 className="font-heading font-bold text-xs text-text-main uppercase">{item.title}</h3>
                      <p className="text-text-dim text-xs mt-1">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-7">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-neon-pink" />
              <h2 className="font-display text-3xl sm:text-4xl text-white tracking-wide">
                NOSSAS COLECOES
              </h2>
              <Sparkles className="w-5 h-5 text-neon-pink" />
            </div>
            <p className="text-text-dim text-sm mt-2">
              Explore nossas colecoes exclusivas e encontre a vibe que combina com voce.
            </p>
          </div>

          <label className="flex items-center justify-center lg:justify-end gap-3 text-xs text-text-dim font-heading uppercase tracking-wider">
            Ordenar por:
            <select
              value={sortBy}
              onChange={event => setSortBy(event.target.value)}
              className="bg-void-light border border-neon-pink/20 rounded-lg px-3 py-2 text-text-main text-sm normal-case focus:outline-none focus:border-neon-pink/50"
            >
              <option value="recentes">Mais recentes</option>
              <option value="produtos">Mais produtos</option>
              <option value="nome">Nome A-Z</option>
            </select>
          </label>
        </div>

        {collections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {collections.map((collection, index) => {
              const collectionProducts = products.filter(product =>
                product.collectionId === collection.id || collection.productIds.includes(product.id)
              )

              return (
                <div
                  key={collection.id}
                  className={`group relative overflow-hidden rounded-lg border bg-void-light transition-all duration-300 hover:-translate-y-1 ${
                    index === 0 ? 'border-neon-pink shadow-[0_0_35px_rgba(255,45,149,0.25)]' : 'border-neon-pink/15 hover:border-neon-pink/50'
                  }`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-void-lighter">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
                    {index === 0 && (
                      <span className="absolute top-3 left-3 rounded-md bg-neon-pink px-3 py-1 text-[10px] font-heading font-bold uppercase tracking-wider text-white">
                        Destaque
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3
                      className="font-display text-3xl tracking-wide leading-none"
                      style={{ color: collection.color || '#ff2d95' }}
                    >
                      {collection.name}
                    </h3>
                    <p className="mt-3 flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-text-muted">
                      <Box className="w-3.5 h-3.5 text-neon-pink" />
                      {collectionProducts.length} produto{collectionProducts.length === 1 ? '' : 's'}
                    </p>
                    <p className="mt-3 min-h-10 text-sm leading-relaxed text-text-muted line-clamp-2">
                      {collection.subtitle || 'Uma selecao exclusiva para transformar seu estilo.'}
                    </p>
                    <Link
                      to={`/colecoes/${collection.id}`}
                      className="mt-4 flex items-center justify-between rounded-md border border-neon-pink/40 px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider text-neon-pink transition-colors hover:bg-neon-pink hover:text-white"
                    >
                      Explorar colecao
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-neon-pink/10 bg-void-light p-10 text-center">
            <Search className="w-10 h-10 text-text-dim mx-auto mb-3" />
            <p className="text-text-dim text-sm">Nenhuma colecao ativa cadastrada no painel.</p>
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-neon-pink" />
            <h2 className="font-display text-3xl sm:text-4xl text-white tracking-wide">
              ESCOLHA SUA VIBE
            </h2>
            <Sparkles className="w-5 h-5 text-neon-pink" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          {categoryOptions.slice(0, 6).map(category => {
            const Icon = categoryIcons[category.value] || Package
            return (
              <button
                key={category.value}
                type="button"
                onClick={() => setSelectedCategory(category.value)}
                className={`h-11 rounded-lg border px-3 text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  selectedCategory === category.value
                    ? 'border-neon-pink bg-neon-pink/25 text-white shadow-lg shadow-neon-pink/15'
                    : 'border-neon-pink/20 bg-void-light text-text-muted hover:border-neon-pink/50 hover:text-text-main'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4 rounded-lg border border-neon-pink/20 bg-void-light/60 p-4">
          <div className="rounded-lg border border-neon-pink/10 bg-void p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-3xl text-white tracking-wide leading-none">
                DESTAQUES DA
                <span className="block text-neon-pink">COLECAO</span>
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-text-muted">
                Confira alguns dos itens mais amados {featuredCollection ? `da colecao ${featuredCollection.name}.` : 'da loja.'}
              </p>
            </div>
            <Link
              to={featuredCollection ? `/colecoes/${featuredCollection.id}` : '/loja'}
              className="mt-5 flex items-center justify-between rounded-md border border-neon-pink/40 px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider text-neon-pink hover:bg-neon-pink hover:text-white transition-colors"
            >
              Ver todos os produtos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} onAdd={() => addItem({
                  id: product.id,
                  name: product.name,
                  price: getFinalPrice(product.price, product.discountPercent),
                  image: product.image,
                })} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-neon-pink/10 bg-void p-8 text-center text-text-dim text-sm flex items-center justify-center">
              Nenhum produto encontrado para essa vibe.
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="relative overflow-hidden rounded-lg border border-neon-pink/25 bg-void-light px-5 py-6 sm:px-8">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#ff2d95,transparent_28%),radial-gradient(circle_at_80%_70%,#b347d9,transparent_26%)]" />
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4 text-center lg:text-left">
              <Gift className="hidden sm:block w-12 h-12 text-neon-pink" />
              <div>
                <p className="font-heading font-bold text-neon-pink uppercase tracking-wider text-sm">Lancamentos sempre</p>
                <h2 className="font-display text-3xl sm:text-4xl text-white tracking-wide">
                  SEU ESTILO. SUA ATITUDE. <span className="text-neon-pink">SUA ESSENCIA.</span>
                </h2>
              </div>
            </div>
            <a
              href="https://discord.gg/quanticstore"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-neon-pink px-6 py-3 text-sm font-heading font-bold uppercase tracking-wider text-white shadow-lg shadow-neon-pink/25 hover:bg-hot-pink transition-colors"
            >
              Entrar no Discord
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: () => void }) {
  const finalPrice = getFinalPrice(product.price, product.discountPercent)

  return (
    <div className="group overflow-hidden rounded-lg border border-neon-pink/20 bg-void">
      <Link to={`/produto/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-void-lighter">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.isNew && (
          <span className="absolute top-2 left-2 rounded bg-neon-pink px-2 py-1 text-[10px] font-heading font-bold uppercase text-white">
            Novo
          </span>
        )}
      </Link>
      <div className="p-3">
        <Link to={`/produto/${product.id}`}>
          <h3 className="font-heading font-bold text-xs sm:text-sm uppercase text-text-main truncate hover:text-neon-pink transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-neon-pink">
            R$ {finalPrice.toFixed(2).replace('.', ',')}
          </p>
          <button
            type="button"
            onClick={onAdd}
            className="w-8 h-8 rounded-md border border-neon-pink/30 text-neon-pink hover:bg-neon-pink hover:text-white flex items-center justify-center transition-colors"
            aria-label={`Comprar ${product.name}`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
