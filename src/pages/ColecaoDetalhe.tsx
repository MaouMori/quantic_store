import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  Diamond,
  Gamepad2,
  Heart,
  Package,
  Palette,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  Zap,
} from 'lucide-react'
import { useAdmin } from '../context/useAdmin'
import { useCart } from '../context/useCart'

const getFinalPrice = (price: number, discountPercent = 0) => {
  const safeDiscount = Math.min(100, Math.max(0, discountPercent))
  return Number((price * (1 - safeDiscount / 100)).toFixed(2))
}

const formatPrice = (price: number) => `R$ ${price.toFixed(2).replace('.', ',')}`

export default function ColecaoDetalhe() {
  const { id } = useParams<{ id: string }>()
  const { storeCollections, products, productCategories, productColors } = useAdmin()
  const { addItem } = useCart()
  const [sortBy, setSortBy] = useState('recentes')
  const [liked, setLiked] = useState<Set<number>>(new Set())

  const collection = storeCollections.find(item => item.id === Number(id))

  const collectionProducts = useMemo(() => {
    const linked = products.filter(product =>
      product.collectionId === Number(id) || collection?.productIds.includes(product.id)
    )
    switch (sortBy) {
      case 'preco-baixo':
        return [...linked].sort((a, b) => getFinalPrice(a.price, a.discountPercent) - getFinalPrice(b.price, b.discountPercent))
      case 'preco-alto':
        return [...linked].sort((a, b) => getFinalPrice(b.price, b.discountPercent) - getFinalPrice(a.price, a.discountPercent))
      case 'nome':
        return [...linked].sort((a, b) => a.name.localeCompare(b.name))
      default:
        return [...linked].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    }
  }, [collection?.productIds, id, products, sortBy])

  if (!collection) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-text-muted text-lg">Colecao nao encontrada.</p>
        <Link to="/colecoes" className="inline-flex items-center gap-2 text-neon-pink mt-4 hover:underline">
          <ChevronLeft className="w-4 h-4" />
          Voltar para colecoes
        </Link>
      </div>
    )
  }

  const finalPrice = getFinalPrice(collection.price, collection.discountPercent)
  const mainCategorySlug = collectionProducts[0]?.category
  const mainCategory = productCategories.find(category => category.slug === mainCategorySlug)?.name || mainCategorySlug || 'Colecao'
  const colorSlugs = Array.from(new Set(collectionProducts.flatMap(product => product.color || []))).slice(0, 8)
  const colorItems = colorSlugs
    .map(slug => productColors.find(color => color.slug === slug))
    .filter(Boolean) as { slug: string; name: string; hex: string }[]
  const launchDate = collection.createdAt
    ? new Date(collection.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    : 'Lancamento'

  const handleAddCollection = () => {
    addItem({
      id: -collection.id,
      name: `Colecao ${collection.name}`,
      price: finalPrice,
      image: collection.image,
    })
  }

  return (
    <div>
      <section className="relative min-h-[620px] overflow-hidden border-b border-neon-pink/10">
        <div className="absolute inset-0">
          <img src={collection.image} alt={collection.name} className="w-full h-full object-cover object-center opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-void via-void/75 to-void/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <nav className="flex items-center gap-2 text-sm text-text-dim mb-16">
            <Link to="/" className="hover:text-neon-pink transition-colors">Inicio</Link>
            <span>/</span>
            <Link to="/colecoes" className="hover:text-neon-pink transition-colors">Colecoes</Link>
            <span>/</span>
            <span className="text-text-main">{collection.name}</span>
          </nav>

          <div className="max-w-xl">
            <p className="font-heading font-bold text-neon-pink tracking-wider mb-4">COLECAO</p>
            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl tracking-wide leading-[0.85]" style={{ color: collection.color }}>
              {collection.name}
            </h1>
            <p className="text-text-main text-lg sm:text-xl leading-relaxed mt-8">
              {collection.subtitle}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10">
              {[
                { icon: Diamond, title: 'Pecas exclusivas', text: 'Modelos vinculados diretamente pelo painel.' },
                { icon: Zap, title: 'Estilo autentico', text: mainCategory ? `Foco em ${mainCategory}.` : 'Uma vibe completa para sua loja.' },
                { icon: Crown, title: 'Qualidade premium', text: 'Produtos selecionados para compor a colecao.' },
                { icon: Gamepad2, title: 'Entrega via Discord', text: 'Receba seus produtos direto no Discord.' },
              ].map(item => (
                <div key={item.title} className="flex gap-3">
                  <div className="w-11 h-11 rounded-lg border border-neon-pink/30 bg-neon-pink/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-neon-pink" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-neon-pink text-xs tracking-wider uppercase">{item.title}</h3>
                    <p className="text-text-dim text-xs leading-relaxed mt-1">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddCollection}
                className="bg-neon-pink hover:bg-hot-pink text-white px-6 py-3 rounded-lg font-heading font-bold text-sm tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                COMPRAR COLECAO
              </button>
              <Link
                to="/loja"
                className="border border-neon-pink/30 text-neon-pink hover:bg-neon-pink/10 px-6 py-3 rounded-lg font-heading font-bold text-sm tracking-wider transition-all flex items-center justify-center gap-2"
              >
                VER TODOS OS PRODUTOS
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-5">
          <div className="review-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-neon-pink" />
              <h2 className="font-heading font-bold text-xl text-text-main">Sobre a colecao</h2>
            </div>
            <p className="text-text-muted leading-relaxed">{collection.subtitle}</p>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-neon-pink font-heading font-bold text-2xl">{formatPrice(finalPrice)}</span>
              {collection.discountPercent > 0 && (
                <>
                  <span className="text-text-dim text-sm line-through">{formatPrice(collection.price)}</span>
                  <span className="bg-neon-pink/10 text-neon-pink text-xs font-bold px-2 py-0.5 rounded">-{collection.discountPercent}%</span>
                </>
              )}
            </div>
          </div>

          <div className="review-card rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { icon: Tag, label: 'Lancamento', value: launchDate },
              { icon: Star, label: 'Categoria', value: mainCategory },
              { icon: Package, label: 'Itens na colecao', value: `${collectionProducts.length} produtos` },
              { icon: Palette, label: 'Cores principais', value: '' },
            ].map(item => (
              <div key={item.label} className="flex gap-3">
                <div className="w-10 h-10 rounded-lg border border-neon-pink/20 bg-neon-pink/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-neon-pink" />
                </div>
                <div>
                  <p className="font-heading font-bold text-neon-pink text-xs uppercase">{item.label}</p>
                  {item.label === 'Cores principais' ? (
                    <div className="flex gap-2 mt-2">
                      {colorItems.length > 0 ? colorItems.map(color => (
                        <span key={color.slug} title={color.name} className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: color.hex }} />
                      )) : <span className="text-text-dim text-sm">Sem cores cadastradas</span>}
                    </div>
                  ) : (
                    <p className="text-text-muted text-sm mt-1">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="review-card rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-neon-pink" />
              <h2 className="font-heading font-bold text-xl text-text-main">Produtos da colecao</h2>
            </div>
            <select
              value={sortBy}
              onChange={event => setSortBy(event.target.value)}
              className="bg-void-light border border-neon-pink/20 rounded-lg px-3 py-2 text-text-main text-sm focus:outline-none focus:border-neon-pink/50"
            >
              <option value="recentes">Mais recentes</option>
              <option value="preco-baixo">Menor preco</option>
              <option value="preco-alto">Maior preco</option>
              <option value="nome">Nome A-Z</option>
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {collectionProducts.map(product => {
              const productPrice = getFinalPrice(product.price, product.discountPercent)
              return (
                <div key={product.id} className="product-card rounded-xl overflow-hidden group">
                  <Link to={`/produto/${product.id}`} className="block">
                    <div className="relative aspect-square bg-void-lighter overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {product.isNew && (
                        <span className="absolute top-2 left-2 bg-neon-pink text-white text-[10px] font-bold px-2 py-0.5 rounded font-heading tracking-wider">
                          NOVO
                        </span>
                      )}
                      <button
                        onClick={event => {
                          event.preventDefault()
                          setLiked(prev => {
                            const next = new Set(prev)
                            if (next.has(product.id)) next.delete(product.id)
                            else next.add(product.id)
                            return next
                          })
                        }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-void/60 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-void"
                      >
                        <Heart className={`w-4 h-4 ${liked.has(product.id) ? 'text-neon-pink fill-neon-pink' : 'text-text-muted hover:text-neon-pink'}`} />
                      </button>
                    </div>
                  </Link>
                  <div className="p-3">
                    <Link to={`/produto/${product.id}`}>
                      <h3 className="font-heading font-bold text-sm text-text-main truncate hover:text-neon-pink transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-neon-pink font-bold text-sm mt-1">{formatPrice(productPrice)}</p>
                    <div className="grid grid-cols-[1fr_42px] mt-3 border border-neon-pink/30 rounded-lg overflow-hidden">
                      <Link to={`/produto/${product.id}`} className="text-neon-pink hover:bg-neon-pink hover:text-white text-xs font-heading font-bold py-2 text-center transition-all">
                        VER DETALHES
                      </Link>
                      <button
                        onClick={() => {
                          if (product.sellIndividually ?? true) {
                            addItem({ id: product.id, name: product.name, price: productPrice, image: product.image })
                          } else {
                            handleAddCollection()
                          }
                        }}
                        className="border-l border-neon-pink/30 text-neon-pink hover:bg-neon-pink hover:text-white flex items-center justify-center transition-all"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {collectionProducts.length === 0 && (
            <p className="text-text-dim text-sm">Nenhum produto vinculado a esta colecao ainda.</p>
          )}
        </div>

        <div className="review-card rounded-xl p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl border border-neon-pink/20 bg-neon-pink/10 flex items-center justify-center">
              <Star className="w-7 h-7 text-neon-pink" />
            </div>
            <div>
              <p className="font-heading font-bold text-neon-pink">Pecas que combinam</p>
              <p className="text-text-muted text-sm">Monte looks unicos com os itens da colecao {collection.name}.</p>
            </div>
          </div>
          <Link to="/loja" className="bg-neon-pink hover:bg-hot-pink text-white px-5 py-3 rounded-lg font-heading font-bold text-sm tracking-wider transition-all flex items-center gap-2">
            VER TODOS OS PRODUTOS
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
