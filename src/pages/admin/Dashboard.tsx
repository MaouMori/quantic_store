import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  ShoppingCart,
  Users,
  BarChart3,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Plus,
  Package,
  Ticket,
  Image,
  Globe,
} from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { products } from '../../data/storeData'

export default function Dashboard() {
  const { orders, activities, roles } = useAdmin()

  const stats = useMemo(() => {
    const totalSales = orders
      .filter(o => o.status === 'concluido')
      .reduce((sum, o) => sum + o.total, 0)
    const totalOrders = orders.length
    const totalCustomers = new Set(orders.map(o => o.customer)).size
    const avgTicket = totalOrders > 0 ? totalSales / totalOrders : 0
    return { totalSales, totalOrders, totalCustomers, avgTicket }
  }, [orders])

  const recentProducts = products.slice(0, 5)
  const recentOrders = orders.slice(0, 5)

  const salesData = [
    { day: '29/04', value: 1200 },
    { day: '30/04', value: 2800 },
    { day: '01/05', value: 3200 },
    { day: '02/05', value: 4100 },
    { day: '03/05', value: 3500 },
    { day: '04/05', value: 2900 },
    { day: '05/05', value: 3800 },
  ]

  const maxSales = Math.max(...salesData.map(d => d.value))

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Vendas (mes)',
            value: `R$ ${stats.totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            change: '+ 23.5% em relacao ao mes anterior',
            changeColor: 'text-green-400',
            icon: TrendingUp,
            iconBg: 'bg-neon-pink/10',
            iconColor: 'text-neon-pink',
          },
          {
            label: 'Pedidos',
            value: stats.totalOrders.toString(),
            change: '+ 18.2% em relacao ao mes anterior',
            changeColor: 'text-green-400',
            icon: ShoppingCart,
            iconBg: 'bg-neon-purple/10',
            iconColor: 'text-neon-purple',
          },
          {
            label: 'Clientes',
            value: stats.totalCustomers.toLocaleString('pt-BR'),
            change: '+ 15.3% em relacao ao mes anterior',
            changeColor: 'text-green-400',
            icon: Users,
            iconBg: 'bg-soft-pink/10',
            iconColor: 'text-soft-pink',
          },
          {
            label: 'Ticket medio',
            value: `R$ ${stats.avgTicket.toFixed(2).replace('.', ',')}`,
            change: '+ 7.8% em relacao ao mes anterior',
            changeColor: 'text-green-400',
            icon: BarChart3,
            iconBg: 'bg-neon-pink/10',
            iconColor: 'text-neon-pink',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="review-card rounded-xl p-5 flex items-center justify-between"
          >
            <div>
              <p className="text-text-dim text-xs mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-text-main">{stat.value}</p>
              <p className={`text-[10px] mt-1 ${stat.changeColor}`}>{stat.change}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products */}
        <div className="review-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-sm text-text-main">Produtos recentes</h3>
            <Link
              to="/admin/produtos"
              className="text-xs text-neon-pink hover:text-hot-pink transition-colors"
            >
              Ver todos
            </Link>
          </div>
          <div className="space-y-3">
            {recentProducts.map(product => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-void-lighter/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-void-lighter overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><span>✨</span></div>'
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-main truncate">{product.name}</p>
                  <p className="text-xs text-neon-pink">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </p>
                </div>
                <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">
                  Ativo
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="review-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-sm text-text-main">Pedidos recentes</h3>
            <Link
              to="/admin/pedidos"
              className="text-xs text-neon-pink hover:text-hot-pink transition-colors"
            >
              Ver todos
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div
                key={order.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-void-lighter/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-void-lighter overflow-hidden flex-shrink-0">
                  <img
                    src={order.customerAvatar}
                    alt={order.customer}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.parentElement!.innerHTML = '<span>👤</span>'
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-main">{order.id}</p>
                  <p className="text-xs text-text-dim">{order.customer} • {order.date}</p>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    order.status === 'concluido'
                      ? 'bg-green-500/10 text-green-400'
                      : order.status === 'em_processamento'
                      ? 'bg-yellow-500/10 text-yellow-400'
                      : order.status === 'pago'
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}
                >
                  {order.status === 'concluido'
                    ? 'Concluido'
                    : order.status === 'em_processamento'
                    ? 'Em processamento'
                    : order.status === 'pago'
                    ? 'Pago'
                    : 'Cancelado'}
                </span>
                <p className="text-sm font-semibold text-text-main">
                  R$ {order.total.toFixed(2).replace('.', ',')}
                </p>
                <button className="p-1 text-text-dim hover:text-text-main">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Chart */}
        <div className="review-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-sm text-text-main">Vendas (ultimos 7 dias)</h3>
            <select className="bg-void-lighter border border-neon-pink/10 rounded-lg px-2 py-1 text-xs text-text-main">
              <option>Ultimos 7 dias</option>
              <option>Ultimos 30 dias</option>
            </select>
          </div>

          {/* Simple bar chart */}
          <div className="flex items-end gap-2 h-40 mb-4">
            {salesData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-neon-pink/20 rounded-t-lg relative group"
                  style={{ height: `${(d.value / maxSales) * 100}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-void-lighter border border-neon-pink/20 rounded px-1.5 py-0.5 text-[10px] text-text-main opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    R$ {d.value}
                  </div>
                </div>
                <span className="text-[10px] text-text-dim">{d.day}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neon-pink/10">
            <div>
              <p className="text-[10px] text-neon-pink mb-0.5">Melhor categoria</p>
              <p className="text-sm font-bold text-text-main">Acessorios</p>
              <p className="text-[10px] text-text-dim">R$ 12.560,00</p>
            </div>
            <div>
              <p className="text-[10px] text-neon-pink mb-0.5">Melhor produto</p>
              <p className="text-sm font-bold text-text-main">Conjunto Rebel Girl</p>
              <p className="text-[10px] text-text-dim">156 vendas</p>
            </div>
            <div>
              <p className="text-[10px] text-neon-pink mb-0.5">Forma de pagamento</p>
              <p className="text-sm font-bold text-text-main">Pix</p>
              <p className="text-[10px] text-text-dim">45.2%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles */}
        <div className="review-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-sm text-text-main">Gerenciar cargos</h3>
            <Link
              to="/admin/cargos"
              className="text-xs bg-neon-pink hover:bg-hot-pink text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Novo cargo
            </Link>
          </div>
          <div className="space-y-2">
            {roles.map(role => (
              <div
                key={role.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-void-lighter/30"
              >
                <span
                  className="text-xs font-bold px-2 py-1 rounded"
                  style={{ backgroundColor: role.color + '20', color: role.color }}
                >
                  {role.color}
                </span>
                <span className="text-sm text-text-main flex-1">{role.name}</span>
                <span className="text-[10px] text-text-dim">
                  {role.permissions.join(', ')}
                </span>
                <div className="flex gap-1">
                  <button className="p-1.5 text-text-dim hover:text-neon-pink transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 text-text-dim hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Products Table */}
        <div className="review-card rounded-xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-sm text-text-main">Gerenciar produtos</h3>
            <Link
              to="/admin/produtos"
              className="text-xs bg-neon-pink hover:bg-hot-pink text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Novo produto
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] text-text-dim uppercase tracking-wider">
                  <th className="pb-3">Produto</th>
                  <th className="pb-3">Categoria</th>
                  <th className="pb-3">Preco</th>
                  <th className="pb-3">Estoque</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Acoes</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {products.slice(0, 5).map(product => (
                  <tr
                    key={product.id}
                    className="border-t border-neon-pink/5 hover:bg-void-lighter/30 transition-colors"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-void-lighter overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><span>✨</span></div>'
                            }}
                          />
                        </div>
                        <span className="text-text-main font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-text-dim capitalize">{product.category}</td>
                    <td className="py-3 text-neon-pink font-semibold">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="py-3 text-text-dim">∞</td>
                    <td className="py-3">
                      <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">
                        Ativo
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <button className="p-1.5 text-text-dim hover:text-neon-pink transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-text-dim hover:text-blue-400 transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-text-dim hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-center gap-1 mt-4">
            {<button className="w-7 h-7 rounded-lg bg-neon-pink text-white text-xs flex items-center justify-center">1</button>}
            {[2, 3, 4, 5].map(p => (
              <button
                key={p}
                className="w-7 h-7 rounded-lg bg-void-lighter border border-neon-pink/10 text-text-muted text-xs hover:text-neon-pink flex items-center justify-center"
              >
                {p}
              </button>
            ))}
            <span className="text-text-dim px-1">...</span>
            <button className="w-7 h-7 rounded-lg bg-void-lighter border border-neon-pink/10 text-text-muted text-xs hover:text-neon-pink flex items-center justify-center">14</button>
          </div>
        </div>
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="review-card rounded-xl p-5">
          <h3 className="font-heading font-bold text-sm text-text-main mb-4">Acoes rapidas</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Package, label: 'Novo produto', color: 'text-red-400' },
              { icon: Image, label: 'Novo banner', color: 'text-neon-pink' },
              { icon: Ticket, label: 'Novo cupom', color: 'text-neon-purple' },
              { icon: ShoppingCart, label: 'Novo pedido manual', color: 'text-green-400' },
              { icon: Users, label: 'Novo usuario', color: 'text-blue-400' },
              { icon: Globe, label: 'Ver site', color: 'text-soft-pink' },
            ].map((action, i) => (
              <button
                key={i}
                className="flex items-center gap-2 p-3 rounded-lg bg-void-lighter/30 hover:bg-void-lighter transition-colors text-left"
              >
                <action.icon className={`w-4 h-4 ${action.color}`} />
                <span className="text-xs text-text-muted">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="review-card rounded-xl p-5 lg:col-span-2">
          <h3 className="font-heading font-bold text-sm text-text-main mb-4">Atividade recente</h3>
          <div className="space-y-3">
            {activities.slice(0, 6).map(activity => (
              <div
                key={activity.id}
                className="flex items-center gap-3 text-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-void-lighter flex items-center justify-center flex-shrink-0">
                  {activity.type === 'order' && <ShoppingCart className="w-4 h-4 text-neon-pink" />}
                  {activity.type === 'product' && <Package className="w-4 h-4 text-neon-purple" />}
                  {activity.type === 'customer' && <Users className="w-4 h-4 text-blue-400" />}
                  {activity.type === 'banner' && <Image className="w-4 h-4 text-green-400" />}
                  {activity.type === 'price' && <BarChart3 className="w-4 h-4 text-yellow-400" />}
                </div>
                <p className="text-text-muted flex-1">{activity.message}</p>
                <span className="text-[10px] text-text-dim">{activity.date}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-xs text-neon-pink hover:text-hot-pink transition-colors border border-neon-pink/20 rounded-lg hover:bg-neon-pink/5">
            Ver todas as atividades
          </button>
        </div>
      </div>
    </div>
  )
}
