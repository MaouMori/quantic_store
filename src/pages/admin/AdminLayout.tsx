import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
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
  Search,
  Menu,
  Skull,
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
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications] = useState(3)

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
              <div className="hidden sm:flex items-center bg-void-lighter border border-neon-pink/10 rounded-lg px-3 py-1.5">
                <Search className="w-4 h-4 text-text-dim mr-2" />
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  className="bg-transparent text-sm text-text-main placeholder-text-dim focus:outline-none w-40"
                />
              </div>

              <button className="relative p-2 text-text-muted hover:text-neon-pink transition-colors">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-neon-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2">
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
