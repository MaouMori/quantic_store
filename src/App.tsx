import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Loja from './pages/Loja'
import Produto from './pages/Produto'
import Colecoes from './pages/Colecoes'
import ColecaoDetalhe from './pages/ColecaoDetalhe'
import Sobre from './pages/Sobre'
import Termos from './pages/Termos'
import Ajuda from './pages/Ajuda'
import MeusPedidos from './pages/MeusPedidos'
import Feedback from './pages/Feedback'
import Checkout from './pages/Checkout'
import StoreLogin from './pages/Login'
import MinhaConta from './pages/MinhaConta'
import CartDrawer from './components/CartDrawer'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/useAuth'
import { AdminProvider } from './context/AdminContext'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminProdutos from './pages/admin/AdminProdutos'
import AdminPedidos from './pages/admin/AdminPedidos'
import AdminCupons from './pages/admin/AdminCupons'
import AdminCargos from './pages/admin/AdminCargos'
import AdminBanners from './pages/admin/AdminBanners'
import AdminColecoes from './pages/admin/AdminColecoes'
import AdminClientes, {
  AdminCategorias,
  AdminTags,
  AdminUsuarios,
  AdminPermissoes,
  AdminPaginas,
  AdminDepoimentos,
  AdminConfiguracoes,
  AdminTransacoes,
  AdminHistorico,
  AdminValores,
  AdminLoja,
  AdminIntegracoes,
  AdminLogs,
} from './pages/admin/AdminPages'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon-pink border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return isAuthenticated && isAdmin ? <>{children}</> : <Navigate to="/login" replace state={{ from: '/admin' }} />
}

function AppContent() {
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [cartOpen])

  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin/login" element={<Navigate to="/login" replace state={{ from: '/admin' }} />} />
      <Route path="/admin/reset-password" element={<Navigate to="/login" replace />} />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="produtos" element={<AdminProdutos />} />
        <Route path="colecoes" element={<AdminColecoes />} />
        <Route path="pedidos" element={<AdminPedidos />} />
        <Route path="clientes" element={<AdminClientes />} />
        <Route path="cupons" element={<AdminCupons />} />
        <Route path="categorias" element={<AdminCategorias />} />
        <Route path="tags" element={<AdminTags />} />
        <Route path="cargos" element={<AdminCargos />} />
        <Route path="usuarios" element={<AdminUsuarios />} />
        <Route path="permissoes" element={<AdminPermissoes />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="paginas" element={<AdminPaginas />} />
        <Route path="depoimentos" element={<AdminDepoimentos />} />
        <Route path="configuracoes" element={<AdminConfiguracoes />} />
        <Route path="transacoes" element={<AdminTransacoes />} />
        <Route path="historico" element={<AdminHistorico />} />
        <Route path="valores" element={<AdminValores />} />
        <Route path="loja" element={<AdminLoja />} />
        <Route path="integracoes" element={<AdminIntegracoes />} />
        <Route path="logs" element={<AdminLogs />} />
      </Route>

      {/* Store Routes */}
      <Route
        path="/*"
        element={
          <div className="min-h-screen bg-void text-text-main font-body relative">
            <div className="noise-overlay" />
            <Navbar onCartClick={() => setCartOpen(true)} />
            
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/loja" element={<Loja />} />
                <Route path="/produto/:id" element={<Produto />} />
                <Route path="/colecoes" element={<Colecoes />} />
                <Route path="/colecoes/:id" element={<ColecaoDetalhe />} />
                <Route path="/sobre" element={<Sobre />} />
                <Route path="/termos" element={<Termos />} />
                <Route path="/ajuda" element={<Ajuda />} />
                <Route path="/meus-pedidos" element={<MeusPedidos />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<StoreLogin />} />
                <Route path="/minha-conta" element={<MinhaConta />} />
              </Routes>
            </main>
            
            <Footer />
            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
          </div>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <CartProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </CartProvider>
      </AdminProvider>
    </AuthProvider>
  )
}

export default App
