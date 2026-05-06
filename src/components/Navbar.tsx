import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, LayoutDashboard, LogIn, LogOut, Menu, Search, ShoppingCart, User, X, Heart } from 'lucide-react'
import { useCart } from '../context/useCart'
import { useAuth } from '../context/useAuth'

interface NavbarProps {
  onCartClick: () => void
}

export default function Navbar({ onCartClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const { totalItems } = useCart()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { path: '/', label: 'HOME' },
    { path: '/loja', label: 'LOJA' },
    { path: '/colecoes', label: 'COLECOES' },
    { path: '/sobre', label: 'SOBRE' },
    { path: '/termos', label: 'TERMOS' },
  ]

  const handleLogout = async () => {
    setAccountOpen(false)
    await logout()
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-void/90 backdrop-blur-xl border-b border-neon-pink/10 shadow-lg shadow-neon-pink/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <span className="font-display text-2xl lg:text-3xl text-neon-pink tracking-wider">
                  QUANTIC
                </span>
                <span className="absolute -bottom-1 left-0 text-[10px] lg:text-xs text-text-muted tracking-[0.3em] font-heading">
                  STORE
                </span>
              </div>
              <Heart className="w-4 h-4 text-neon-pink fill-neon-pink animate-pulse" />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link text-sm font-heading font-semibold tracking-wider transition-colors ${
                    location.pathname === link.path
                      ? 'text-neon-pink active'
                      : 'text-text-muted hover:text-text-main'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 lg:gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-text-muted hover:text-neon-pink transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={onCartClick}
                className="relative p-2 text-text-muted hover:text-neon-pink transition-colors group"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-neon-pink text-white text-xs font-bold rounded-full flex items-center justify-center badge-bounce">
                    {totalItems}
                  </span>
                )}
              </button>

              <div className="relative hidden sm:block">
                <button
                  onClick={() => setAccountOpen(open => !open)}
                  className={`flex items-center gap-1 p-2 transition-colors ${isAuthenticated ? 'text-neon-pink' : 'text-text-muted hover:text-neon-pink'}`}
                  title={isAuthenticated ? `Logado como ${user?.name}` : 'Minha conta'}
                >
                  <User className="w-5 h-5" />
                  {isAuthenticated && (
                    <span className="hidden xl:inline max-w-24 truncate text-xs font-heading font-bold">
                      {user?.name}
                    </span>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
                </button>

                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-neon-pink/20 bg-void/95 backdrop-blur-xl shadow-xl shadow-black/30 p-2">
                    {isAuthenticated ? (
                      <>
                        <div className="px-3 py-2 border-b border-neon-pink/10 mb-1">
                          <p className="text-text-main text-sm font-heading font-bold truncate">{user?.name}</p>
                          <p className="text-text-dim text-xs truncate">{user?.email}</p>
                        </div>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-muted hover:bg-neon-pink/10 hover:text-neon-pink transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Painel admin
                          </Link>
                        )}
                        <Link
                          to="/meus-pedidos"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-muted hover:bg-neon-pink/10 hover:text-neon-pink transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Meus pedidos
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-muted hover:bg-neon-pink/10 hover:text-neon-pink transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sair
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/meus-pedidos"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-muted hover:bg-neon-pink/10 hover:text-neon-pink transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Meus pedidos
                        </Link>
                        <Link
                          to="/feedback"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-muted hover:bg-neon-pink/10 hover:text-neon-pink transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          Feedback
                        </Link>
                        <Link
                          to="/admin/login"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-neon-pink hover:bg-neon-pink/10 transition-colors"
                        >
                          <LogIn className="w-4 h-4" />
                          Admin
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Link
                to={isAuthenticated && isAdmin ? '/admin' : '/admin/login'}
                className="hidden md:flex items-center gap-1.5 bg-neon-pink/10 hover:bg-neon-pink/20 border border-neon-pink/20 text-neon-pink px-3 py-1.5 rounded-lg text-xs font-heading font-bold tracking-wider transition-all"
                title="Painel Administrativo"
              >
                <LogIn className="w-3.5 h-3.5" />
                {isAuthenticated && isAdmin ? 'PAINEL' : isAuthenticated ? 'LOGADO' : 'LOGIN'}
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-text-muted hover:text-neon-pink transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            searchOpen ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full bg-void-light border border-neon-pink/20 rounded-lg px-4 py-2 pl-10 text-text-main placeholder-text-dim focus:outline-none focus:border-neon-pink/50 transition-colors"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-void/95 backdrop-blur-xl border-t border-neon-pink/10 px-4 py-4 space-y-1">
            {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-heading font-semibold tracking-wider transition-colors ${
                  location.pathname === link.path
                    ? 'bg-neon-pink/10 text-neon-pink'
                    : 'text-text-muted hover:bg-void-lighter hover:text-text-main'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/meus-pedidos"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-heading font-semibold tracking-wider text-text-muted hover:bg-void-lighter hover:text-text-main transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              MEUS PEDIDOS
            </Link>
            <Link
              to="/feedback"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-heading font-semibold tracking-wider text-text-muted hover:bg-void-lighter hover:text-text-main transition-colors"
            >
              <Heart className="w-4 h-4" />
              FEEDBACK
            </Link>
            <Link
              to={isAuthenticated && isAdmin ? '/admin' : '/admin/login'}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-heading font-semibold tracking-wider text-neon-pink hover:bg-neon-pink/10 transition-colors"
            >
              {isAuthenticated && isAdmin ? <LayoutDashboard className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              {isAuthenticated && isAdmin ? 'PAINEL ADMIN' : isAuthenticated ? `LOGADO: ${user?.name}` : 'LOGIN'}
            </Link>
            {isAuthenticated && (
              <button
                onClick={() => {
                  setMobileOpen(false)
                  void handleLogout()
                }}
                className="flex items-center gap-2 w-full px-4 py-3 rounded-lg text-sm font-heading font-semibold tracking-wider text-text-muted hover:bg-void-lighter hover:text-text-main transition-colors"
              >
                <LogOut className="w-4 h-4" />
                SAIR
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="h-16 lg:h-20" />
    </>
  )
}
