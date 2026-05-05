import { CreditCard, History, ClipboardList, Settings, MessageSquare, FileText, FolderTree, Tag, Lock, UserCog } from 'lucide-react'
import { useAdmin } from '../../context/useAdmin'

export default function AdminClientes() {
  const { customers } = useAdmin()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Clientes</h1>
        <p className="text-text-dim text-sm">{customers.length} clientes cadastrados</p>
      </div>
      <div className="review-card rounded-xl p-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] text-text-dim uppercase tracking-wider">
                <th className="pb-3">Cliente</th>
                <th className="pb-3">Discord</th>
                <th className="pb-3">Pedidos</th>
                <th className="pb-3">Gasto total</th>
                <th className="pb-3">Desde</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {customers.map(c => (
                <tr key={c.id} className="border-t border-neon-pink/5 hover:bg-void-lighter/30 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-void-lighter overflow-hidden">
                        <img src={c.avatar} alt={c.name} className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span>👤</span>' }}
                        />
                      </div>
                      <div>
                        <p className="text-text-main font-medium">{c.name}</p>
                        <p className="text-text-dim text-xs">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-text-dim">{c.discord}</td>
                  <td className="py-3 text-text-main">{c.totalOrders}</td>
                  <td className="py-3 text-neon-pink font-semibold">R$ {c.totalSpent.toFixed(2).replace('.', ',')}</td>
                  <td className="py-3 text-text-dim">{c.joinedAt}</td>
                  <td className="py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.status === 'ativo' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {c.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function AdminCategorias() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Categorias</h1>
        <p className="text-text-dim text-sm">Gerencie categorias de produtos</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <FolderTree className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Gerenciamento de categorias em desenvolvimento.</p>
      </div>
    </div>
  )
}

export function AdminTags() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Tags</h1>
        <p className="text-text-dim text-sm">Gerencie tags de produtos</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <Tag className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Gerenciamento de tags em desenvolvimento.</p>
      </div>
    </div>
  )
}

export function AdminUsuarios() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Usuarios</h1>
        <p className="text-text-dim text-sm">Gerencie usuarios do painel</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <UserCog className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Gerenciamento de usuarios em desenvolvimento.</p>
      </div>
    </div>
  )
}

export function AdminPermissoes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Permissoes</h1>
        <p className="text-text-dim text-sm">Configure permissoes detalhadas</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <Lock className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Configuracao de permissoes em desenvolvimento.</p>
      </div>
    </div>
  )
}

export function AdminPaginas() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Paginas</h1>
        <p className="text-text-dim text-sm">Gerencie paginas do site</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <FileText className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Gerenciamento de paginas em desenvolvimento.</p>
      </div>
    </div>
  )
}

export function AdminDepoimentos() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Depoimentos</h1>
        <p className="text-text-dim text-sm">Gerencie depoimentos de clientes</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <MessageSquare className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Gerenciamento de depoimentos em desenvolvimento.</p>
      </div>
    </div>
  )
}

export function AdminConfiguracoes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Configuracoes do Site</h1>
        <p className="text-text-dim text-sm">Configure informacoes gerais</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <Settings className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Configuracoes em desenvolvimento.</p>
      </div>
    </div>
  )
}

export function AdminTransacoes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Transacoes</h1>
        <p className="text-text-dim text-sm">Historico de transacoes</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <CreditCard className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Historico de transacoes em desenvolvimento.</p>
      </div>
    </div>
  )
}

export function AdminHistorico() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Historico de Compras</h1>
        <p className="text-text-dim text-sm">Relatorio completo de compras</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <History className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Historico de compras em desenvolvimento.</p>
      </div>
    </div>
  )
}

export function AdminValores() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Valores e Taxas</h1>
        <p className="text-text-dim text-sm">Configure precos e taxas</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <ClipboardList className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Configuracao de valores em desenvolvimento.</p>
      </div>
    </div>
  )
}

export function AdminLoja() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Configuracoes da Loja</h1>
        <p className="text-text-dim text-sm">Configure opcoes da loja</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <Settings className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Configuracoes da loja em desenvolvimento.</p>
      </div>
    </div>
  )
}

export function AdminIntegracoes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Integracoes</h1>
        <p className="text-text-dim text-sm">Configure integracoes externas</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <CreditCard className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Integracoes em desenvolvimento.</p>
      </div>
    </div>
  )
}

export function AdminLogs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-main">Logs do Sistema</h1>
        <p className="text-text-dim text-sm">Visualize logs e auditoria</p>
      </div>
      <div className="review-card rounded-xl p-5 text-center py-16">
        <ClipboardList className="w-12 h-12 text-text-dim mx-auto mb-4" />
        <p className="text-text-muted">Logs do sistema em desenvolvimento.</p>
      </div>
    </div>
  )
}
