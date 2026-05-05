import { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { useAdmin } from '../../context/useAdmin'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Ticket,
  FolderTree,
  Tag,
  Shield,
  UserCog,
  Lock,
  Image,
  FileText,
  MessageSquare,
  Settings,
  CreditCard,
  History,
  ClipboardList,
  ChevronDown,
  LogOut,
  Bell,
  Menu,
  Skull,
  Store,
  User,
} from 'lucide-react'

const menuGroups = [
  {
    title: null,
    items: [
      { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'GERENCIAMENTO',
    items: [
      { path: '/admin/produtos', label: 'Produtos', icon: Package },
      { path: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
      { path: '/admin/clientes', label: 'Clientes', icon: Users },
      { path: '/admin/cupons', label: 'Cupons', icon: Ticket },
      { path: '/admin/categorias', label: 'Categorias', icon: FolderTree },
      { path: '/admin/tags', label: 'Tags', icon: Tag },
    ],
  },
  {
    title: 'COMUNIDADE',
    items: [
      { path: '/admin/cargos', label: 'Cargos', icon: Shield },
      { path: '/admin/usuarios', label: 'Usuarios', icon: UserCog },
      { path: '/admin/permissoes', label: 'Permissoes', icon: Lock },
    ],
  },
  {
    title: 'CONTEUDO',
    items: [
      { path: '/admin/banners', label: 'Banners', icon: Image },
      { path: '/admin/paginas', label: 'Paginas', icon: FileText },
      { path: '/admin/depoimentos', label: 'Depoimentos', icon: MessageSquare },
      { path: '/admin/configuracoes', label: 'Configuracoes do Site', icon: Settings },
    ],
  },
  {
    title: 'FINANCEIRO',
    items: [
      { path: '/admin/transacoes', label: 'Transacoes', icon: CreditCard },
      { path: '/admin/historico', label: 'Historico de Compras', icon: History },
      { path: '/admin/valores', label: 'Valores e Taxas', icon: ClipboardList },
    ],
  },
  {
    title: 'CONFIGURACOES',
    items: [
      { path: '/admin/loja', label: 'Loja', icon: Settings },
      { path: '/admin/integracoes', label: 'Integracoes', icon: CreditCard },
      { path: '/admin/logs', label: 'Logs do Sistema', icon: ClipboardList },
    ],
  },
]

export default function AdminLayout() {
  const { user, logout, isLoading } = useAuth()
  const { products, orders, banners, coupons } = useAdmin()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const notifications = [
    `${products.length} produtos cadastrados`,
    `${orders.length} pedidos no painel`,
    `${banners.filter(banner => banner.active).length} banners ativos`,
    `${coupons.filter(coupon => coupon.active).length} cupons ativos`,
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/admin/login')
    }
  }, [isLoading, user, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon-pink border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-void flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-void-light border-r border-neon-pink/10 flex flex-col z-50 transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-neon-pink/10">
          <div className="flex items-center gap-2">
            <Skull className="w-6 h-6 text-neon-pink" />
            <div>
              <span className="font-display text-xl text-neon-pink tracking-wider">QUANTIC</span>
              <span className="block text-[10px] text-text-dim tracking-widest">STORE</span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-4">
          {menuGroups.map((group, gi) => (
            <div key={gi} className="mb-4">
              {group.title && (
                <p className="px-4 text-[10px] font-heading font-bold text-text-dim tracking-wider mb-2">
                  {group.title}
                </p>
              )}
              <nav className="space-y-0.5 px-2">
                {group.items.map(item => {
                  const isActive = location.pathname === item.path
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                        isActive
                          ? 'bg-neon-pink/10 text-neon-pink font-semibold'
                          : 'text-text-muted hover:bg-void-lighter hover:text-text-main'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </NavLink>
                  )
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="p-4 border-t border-neon-pink/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center overflow-hidden">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.parentElement!.innerHTML = '<span class="text-lg">👤</span>'
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-main truncate">{user?.name}</p>
              <p className="text-[10px] text-text-dim truncate">{user?.role}</p>
            </div>
            <button
              onClick={() => {
                logout()
                navigate('/admin/login')
              }}
              className="p-2 text-text-dim hover:text-red-400 transition-colors"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-text-dim mt-3 text-center">
            Quantic Store - Painel v1.0
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-void/80 backdrop-blur-xl border-b border-neon-pink/10">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-text-muted hover:text-neon-pink transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <Menu className="w-5 h-5 text-text-muted hidden lg:block" />
                <h1 className="font-heading font-bold text-sm text-text-main tracking-wider">
                  Painel Administrativo
                </h1>
                <span className="text-neon-pink">✦</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="hidden sm:flex items-center gap-2 bg-void-lighter border border-neon-pink/10 rounded-lg px-3 py-2 text-xs font-heading font-bold text-text-muted hover:text-neon-pink hover:border-neon-pink/30 transition-colors"
              >
                <Store className="w-4 h-4" />
                VER LOJA
              </button>

              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationsOpen(open => !open)
                    setUserMenuOpen(false)
                  }}
                  className="relative p-2 text-text-muted hover:text-neon-pink transition-colors"
                  title="Avisos do painel"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-neon-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-xl border border-neon-pink/10 bg-void-light shadow-xl shadow-black/30 p-3">
                    <p className="font-heading font-bold text-xs text-text-main tracking-wider mb-2">AVISOS DO PAINEL</p>
                    <div className="space-y-2">
                      {notifications.map(notification => (
                        <div key={notification} className="rounded-lg bg-void-lighter px-3 py-2 text-xs text-text-muted">
                          {notification}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => {
                    setUserMenuOpen(open => !open)
                    setNotificationsOpen(false)
                  }}
                  className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-void-lighter transition-colors"
                >
                <div className="w-8 h-8 rounded-full bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center overflow-hidden">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.parentElement!.innerHTML = '<span class="text-sm">👤</span>'
                    }}
                  />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-text-main">{user?.name}</p>
                  <p className="text-[10px] text-text-dim">{user?.role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-text-dim" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-neon-pink/10 bg-void-light shadow-xl shadow-black/30 p-2">
                    <button
                      onClick={() => navigate('/admin')}
                      className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-void-lighter hover:text-neon-pink transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Meu painel
                    </button>
                    <button
                      onClick={() => navigate('/')}
                      className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-void-lighter hover:text-neon-pink transition-colors"
                    >
                      <Store className="w-4 h-4" />
                      Voltar para loja
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
