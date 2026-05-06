import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingCart,
  Heart,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
} from 'lucide-react'
import { categories as defaultCategories, styles as defaultStyles, colors as defaultColors } from '../data/storeData'
import { useAdmin } from '../context/useAdmin'
import { useCart } from '../context/useCart'

const ITEMS_PER_PAGE = 16

const getFinalPrice = (price: number, discountPercent = 0) => {
  const safeDiscount = Math.min(100, Math.max(0, discountPercent))
  return Number((price * (1 - safeDiscount / 100)).toFixed(2))
}

export default function Loja() {
  const { products, banners, productCategories, productStyles, productColors } = useAdmin()
  const pageBanners = banners.filter(banner => banner.active && banner.position === 'loja')
  const categories = [
    { value: 'todos', label: 'Todos os produtos' },
    ...(productCategories.length > 0
      ? productCategories.filter(item => item.active).map(item => ({ value: item.slug, label: item.name }))
      : defaultCategories.filter(item => item.value !== 'todos')),
  ]
  const styles = productStyles.length > 0
    ? productStyles.filter(item => item.active).map(item => ({ value: item.slug, label: item.name }))
    : defaultStyles
  const colors = productColors.length > 0
    ? productColors.filter(item => item.active).map(item => ({ value: item.slug, hex: item.hex, label: item.name }))
    : defaultColors.map(item => ({ value: item.value, hex: item.hex, label: item.value }))
  const [category, setCategory] = useState('todos')
  const [selectedStyles, setSelectedStyles] = useState<Set<string>>(new Set())
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set())
  const [priceRange, setPriceRange] = useState(200)
  const [onlyNew, setOnlyNew] = useState(false)
  const [liked, setLiked] = useState<Set<number>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recentes')
  const [currentPage, setCurrentPage] = useState(1)
  const [openFilters, setOpenFilters] = useState<Set<string>>(
    new Set(['categorias', 'preco', 'cor', 'estilo', 'lancamentos'])
  )
  const { addItem } = useCart()

  const toggleFilter = (key: string) => {
    setOpenFilters(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const toggleColor = (value: string) => {
    setSelectedColors(prev => prev.has(value) ? new Set() : new Set([value]))
    setCurrentPage(1)
  }

  const toggleStyle = (value: string) => {
    setSelectedStyles(prev => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return next
    })
    setCurrentPage(1)
  }

  const toggleLike = (id: number) => {
    setLiked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const clearFilters = () => {
    setCategory('todos')
    setSelectedStyles(new Set())
    setSelectedColors(new Set())
    setPriceRange(200)
    setOnlyNew(false)
    setSearchQuery('')
    setCurrentPage(1)
  }

  const activeFiltersCount =
    (category !== 'todos' ? 1 : 0) +
    selectedStyles.size +
    selectedColors.size +
    (priceRange < 200 ? 1 : 0) +
    (onlyNew ? 1 : 0)

  const filtered = useMemo(() => {
    let result = products.filter(p => {
      const matchCategory = category === 'todos' || p.category === category
      const matchVisibility = p.sellIndividually ?? true
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchPrice = getFinalPrice(p.price, p.discountPercent) <= priceRange
      const matchNew = !onlyNew || p.isNew
      const matchStyle =
        selectedStyles.size === 0 ||
        (p.style && p.style.some(s => selectedStyles.has(s)))
      const matchColor =
        selectedColors.size === 0 ||
        (p.color && p.color.some(c => selectedColors.has(c)))
      return matchVisibility && matchCategory && matchSearch && matchPrice && matchNew && matchStyle && matchColor
    })

    switch (sortBy) {
      case 'preco-baixo':
        result = [...result].sort((a, b) => getFinalPrice(a.price, a.discountPercent) - getFinalPrice(b.price, b.discountPercent))
        break
      case 'preco-alto':
        result = [...result].sort((a, b) => getFinalPrice(b.price, b.discountPercent) - getFinalPrice(a.price, a.discountPercent))
        break
      case 'nome':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'recentes':
      default:
        result = [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    }

    return result
  }, [category, products, searchQuery, priceRange, onlyNew, selectedStyles, selectedColors, sortBy])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div>
      {pageBanners.length > 0 && (
        <div className="mb-8">
          {pageBanners.map(banner => (
            <div key={banner.id} className="w-full min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)] overflow-hidden bg-void">
              <img src={banner.image} alt={banner.title || 'Banner'} className="w-full h-full min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)] object-cover object-center" />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl sm:text-4xl text-white tracking-wide mb-2">
          LOJA
        </h1>
        <p className="text-text-muted text-sm">
          Pecas exclusivas para voce expressar quem e, do seu jeito.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-4">
            {/* Filter Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-neon-pink">✦</span>
                <h3 className="font-heading font-bold text-sm text-text-main tracking-wider">
                  FILTROS
                </h3>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-neon-pink hover:text-hot-pink transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Limpar ({activeFiltersCount})
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="border border-neon-pink/10 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleFilter('categorias')}
                className="w-full flex items-center justify-between p-3 bg-void-lighter/50"
              >
                <span className="font-heading font-bold text-xs text-text-main tracking-wider">
                  CATEGORIAS
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-text-muted transition-transform ${
                    openFilters.has('categorias') ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFilters.has('categorias') && (
                <div className="p-2 space-y-0.5">
                  {categories.map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => {
                        setCategory(cat.value)
                        setCurrentPage(1)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        category === cat.value
                          ? 'bg-neon-pink/10 text-neon-pink font-semibold'
                          : 'text-text-muted hover:bg-void-lighter hover:text-text-main'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="border border-neon-pink/10 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleFilter('preco')}
                className="w-full flex items-center justify-between p-3 bg-void-lighter/50"
              >
                <span className="font-heading font-bold text-xs text-text-main tracking-wider">PRECO</span>
                <ChevronDown
                  className={`w-4 h-4 text-text-muted transition-transform ${
                    openFilters.has('preco') ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFilters.has('preco') && (
                <div className="p-4 space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange}
                    onChange={e => {
                      setPriceRange(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="w-full accent-neon-pink"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 bg-void-lighter border border-neon-pink/10 rounded-lg px-3 py-2 text-center">
                      <span className="text-text-dim text-xs">R$ 0,00</span>
                    </div>
                    <div className="flex-1 bg-void-lighter border border-neon-pink/10 rounded-lg px-3 py-2 text-center">
                      <span className="text-neon-pink text-xs font-bold">
                        R$ {priceRange.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Colors */}
            <div className="border border-neon-pink/10 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleFilter('cor')}
                className="w-full flex items-center justify-between p-3 bg-void-lighter/50"
              >
                <span className="font-heading font-bold text-xs text-text-main tracking-wider">COR</span>
                <ChevronDown
                  className={`w-4 h-4 text-text-muted transition-transform ${
                    openFilters.has('cor') ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFilters.has('cor') && (
                <div className="p-3 flex flex-wrap gap-2">
                  {colors.map(c => (
                    <button
                      key={c.value}
                      onClick={() => toggleColor(c.value)}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        selectedColors.has(c.value)
                          ? 'border-white scale-110'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.label}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Styles */}
            <div className="border border-neon-pink/10 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleFilter('estilo')}
                className="w-full flex items-center justify-between p-3 bg-void-lighter/50"
              >
                <span className="font-heading font-bold text-xs text-text-main tracking-wider">ESTILO</span>
                <ChevronDown
                  className={`w-4 h-4 text-text-muted transition-transform ${
                    openFilters.has('estilo') ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFilters.has('estilo') && (
                <div className="p-2 space-y-0.5">
                  {styles.map(s => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => toggleStyle(s.value)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-void-lighter transition-colors"
                    >
                      <div
                        className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${
                          selectedStyles.has(s.value)
                            ? 'bg-neon-pink border-neon-pink'
                            : 'border-text-dim'
                        }`}
                      >
                        {selectedStyles.has(s.value) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-text-muted text-sm">{s.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* New Releases */}
            <div className="border border-neon-pink/10 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleFilter('lancamentos')}
                className="w-full flex items-center justify-between p-3 bg-void-lighter/50"
              >
                <span className="font-heading font-bold text-xs text-text-main tracking-wider">LANCAMENTOS</span>
                <ChevronDown
                  className={`w-4 h-4 text-text-muted transition-transform ${
                    openFilters.has('lancamentos') ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFilters.has('lancamentos') && (
                <div className="p-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${
                        onlyNew
                          ? 'bg-neon-pink border-neon-pink'
                          : 'border-text-dim'
                      }`}
                      onClick={() => {
                        setOnlyNew(!onlyNew)
                        setCurrentPage(1)
                      }}
                    >
                      {onlyNew && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-text-muted text-sm">Apenas lancamentos</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 pl-10 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50 transition-colors text-sm"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-text-dim text-xs">
                Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} de {filtered.length} produtos
              </span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-void-light border border-neon-pink/20 rounded-lg px-3 py-2 text-text-main text-sm focus:outline-none focus:border-neon-pink/50"
              >
                <option value="recentes">Mais recentes</option>
                <option value="preco-baixo">Menor preco</option>
                <option value="preco-alto">Maior preco</option>
                <option value="nome">Nome A-Z</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {paginated.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginated.map(product => (
                (() => {
                  const finalPrice = getFinalPrice(product.price, product.discountPercent)
                  const discountPercent = Math.min(100, Math.max(0, product.discountPercent || 0))
                  return (
                <div
                  key={product.id}
                  className="product-card rounded-xl overflow-hidden group"
                >
                  <Link to={`/produto/${product.id}`} className="block">
                    <div className="relative aspect-square bg-void-lighter overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement!
                          parent.innerHTML = `
                            <div class="w-full h-full flex flex-col items-center justify-center text-center p-4 bg-void-lighter">
                              <div class="w-16 h-16 rounded-full bg-neon-pink/10 flex items-center justify-center mb-2">
                                <span class="text-2xl">✨</span>
                              </div>
                              <p class="text-text-dim text-[10px] font-mono">${product.image}</p>
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

                  <div className="p-3">
                    <Link to={`/produto/${product.id}`}>
                      <h3 className="font-heading font-bold text-sm text-text-main truncate hover:text-neon-pink transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between mt-2">
                      <div className="min-w-0">
                        <span className="block text-neon-pink font-bold text-sm">
                          R$ {finalPrice.toFixed(2).replace('.', ',')}
                        </span>
                        {discountPercent > 0 && (
                          <span className="block text-text-dim text-[10px] line-through">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          addItem({
                            id: product.id,
                            name: product.name,
                            price: finalPrice,
                            image: product.image,
                          })
                        }
                        className="w-8 h-8 rounded-lg border border-neon-pink/30 text-neon-pink hover:bg-neon-pink hover:text-white flex items-center justify-center transition-all"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                  )
                })()
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-text-dim mx-auto mb-4" />
              <p className="text-text-muted">Nenhum produto encontrado.</p>
              <button
                onClick={clearFilters}
                className="text-neon-pink text-sm mt-2 hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg bg-void-light border border-neon-pink/20 text-text-muted hover:text-neon-pink disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => {
                  if (p === 1 || p === totalPages) return true
                  if (Math.abs(p - currentPage) <= 1) return true
                  return false
                })
                .reduce((acc: (number | string)[], p, i, arr) => {
                  if (i > 0 && (arr[i - 1] as number) < p - 1) {
                    acc.push('...')
                  }
                  acc.push(p)
                  return acc
                }, [])
                .map((p, i) =>
                  typeof p === 'string' ? (
                    <span key={`dots-${i}`} className="text-text-dim px-1">{p}</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                        currentPage === p
                          ? 'bg-neon-pink text-white'
                          : 'bg-void-light border border-neon-pink/20 text-text-muted hover:text-neon-pink'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg bg-void-light border border-neon-pink/20 text-text-muted hover:text-neon-pink disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
