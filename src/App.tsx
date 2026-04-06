import { useState } from "react"

interface Transacao {
  id: number
  tipo: "receita" | "despesa"
  nome: string
  valor: number
  categoria: string
  membro: string
  data: string
  recorrente: boolean
}

const CATEGORIAS = ["Moradia", "Alimentacao", "Transporte", "Saude", "Lazer", "Educacao", "Outros"]
const MEMBROS = [
  { nome: "Pai", cor: "bg-blue-500", emoji: "👨" },
  { nome: "Mae", cor: "bg-pink-500", emoji: "👩" },
  { nome: "Filho", cor: "bg-green-500", emoji: "🧒" },
]

let nextId = 1

export default function App() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([
    { id: nextId++, tipo: "receita", nome: "Salario", valor: 8000, categoria: "Outros", membro: "Pai", data: "2026-04-01", recorrente: true },
    { id: nextId++, tipo: "despesa", nome: "Aluguel", valor: 2500, categoria: "Moradia", membro: "Pai", data: "2026-04-05", recorrente: true },
    { id: nextId++, tipo: "despesa", nome: "Supermercado", valor: 850, categoria: "Alimentacao", membro: "Mae", data: "2026-04-03", recorrente: false },
    { id: nextId++, tipo: "receita", nome: "Freelance", valor: 2000, categoria: "Outros", membro: "Mae", data: "2026-04-10", recorrente: false },
  ])

  const [tela, setTela] = useState<"dash" | "add" | "metas">("dash")
  const [form, setForm] = useState({ tipo: "despesa" as "receita" | "despesa", nome: "", valor: "", categoria: "Outros", membro: "Pai", recorrente: false })
  const [filtro, setFiltro] = useState("")

  const totalReceitas = transacoes.filter(t => t.tipo === "receita").reduce((s, t) => s + t.valor, 0)
  const totalDespesas = transacoes.filter(t => t.tipo === "despesa").reduce((s, t) => s + t.valor, 0)
  const saldo = totalReceitas - totalDespesas

  const porCategoria = CATEGORIAS.map(c => ({
    cat: c,
    total: transacoes.filter(t => t.tipo === "despesa" && t.categoria === c).reduce((s, t) => s + t.valor, 0),
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total)

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  const adicionar = () => {
    if (!form.nome || !form.valor) return
    setTransacoes(prev => [...prev, {
      id: nextId++,
      tipo: form.tipo,
      nome: form.nome,
      valor: parseFloat(form.valor) || 0,
      categoria: form.categoria,
      membro: form.membro,
      data: new Date().toISOString().split("T")[0],
      recorrente: form.recorrente,
    }])
    setForm({ tipo: "despesa", nome: "", valor: "", categoria: "Outros", membro: "Pai", recorrente: false })
    setTela("dash")
  }

  const remover = (id: number) => setTransacoes(prev => prev.filter(t => t.id !== id))

  const transacoesFiltradas = filtro
    ? transacoes.filter(t => t.nome.toLowerCase().includes(filtro.toLowerCase()) || t.categoria.toLowerCase().includes(filtro.toLowerCase()))
    : transacoes

  // Metas
  const metas = [
    { nome: "Fundo de Emergencia", alvo: 30000, atual: 12500, cor: "from-blue-600 to-blue-400" },
    { nome: "Viagem Europa", alvo: 20000, atual: 7800, cor: "from-purple-600 to-pink-400" },
    { nome: "Reforma Casa", alvo: 50000, atual: 15000, cor: "from-amber-600 to-yellow-400" },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Family Finance</h1>
        <div className="flex gap-1">
          {(["dash", "metas"] as const).map(t => (
            <button key={t} onClick={() => setTela(t)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${tela === t ? "bg-emerald-500/20 text-emerald-400" : "text-gray-500 hover:text-gray-300"}`}>
              {t === "dash" ? "Dashboard" : "Metas"}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4 space-y-4">

        {tela === "dash" && (
          <>
            {/* Cards de Saldo */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-900 rounded-2xl p-3 border border-gray-800">
                <div className="text-[10px] text-gray-500 mb-1">Saldo</div>
                <div className={`text-lg font-bold ${saldo >= 0 ? "text-emerald-400" : "text-red-400"}`}>{fmt(saldo)}</div>
              </div>
              <div className="bg-gray-900 rounded-2xl p-3 border border-gray-800">
                <div className="text-[10px] text-gray-500 mb-1">Receitas</div>
                <div className="text-lg font-bold text-emerald-400">{fmt(totalReceitas)}</div>
              </div>
              <div className="bg-gray-900 rounded-2xl p-3 border border-gray-800">
                <div className="text-[10px] text-gray-500 mb-1">Despesas</div>
                <div className="text-lg font-bold text-red-400">{fmt(totalDespesas)}</div>
              </div>
            </div>

            {/* Membros */}
            <div className="flex gap-2">
              {MEMBROS.map(m => {
                const gastos = transacoes.filter(t => t.membro === m.nome && t.tipo === "despesa").reduce((s, t) => s + t.valor, 0)
                return (
                  <div key={m.nome} className="flex-1 bg-gray-900 rounded-xl p-2 border border-gray-800 text-center">
                    <div className="text-xl">{m.emoji}</div>
                    <div className="text-[10px] text-gray-400">{m.nome}</div>
                    <div className="text-xs font-bold text-red-400/80">{fmt(gastos)}</div>
                  </div>
                )
              })}
            </div>

            {/* Gastos por Categoria */}
            {porCategoria.length > 0 && (
              <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                <div className="text-xs font-bold text-gray-400 mb-3">Gastos por Categoria</div>
                {porCategoria.map(c => (
                  <div key={c.cat} className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] text-gray-400 w-24 truncate">{c.cat}</span>
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                        style={{ width: `${Math.min(100, (c.total / totalDespesas) * 100)}%` }} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-300 w-20 text-right">{fmt(c.total)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Busca */}
            <input type="text" placeholder="Buscar transacao..." value={filtro} onChange={e => setFiltro(e.target.value)}
              className="w-full px-4 py-2 rounded-xl text-sm bg-gray-900 border border-gray-800 text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none" />

            {/* Lista de Transações */}
            <div className="space-y-2">
              {transacoesFiltradas.slice().reverse().map(t => (
                <div key={t.id} className="bg-gray-900 rounded-xl p-3 border border-gray-800 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${t.tipo === "receita" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                    {t.tipo === "receita" ? "+" : "-"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-200 truncate">{t.nome}</div>
                    <div className="text-[10px] text-gray-500">{t.categoria} - {t.membro} {t.recorrente ? "🔄" : ""}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${t.tipo === "receita" ? "text-emerald-400" : "text-red-400"}`}>
                      {t.tipo === "receita" ? "+" : "-"}{fmt(t.valor)}
                    </div>
                    <div className="text-[10px] text-gray-600">{t.data}</div>
                  </div>
                  <button onClick={() => remover(t.id)} className="text-gray-600 hover:text-red-400 text-xs">x</button>
                </div>
              ))}
            </div>

            {/* FAB */}
            <button onClick={() => setTela("add")}
              className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-2xl font-bold shadow-lg shadow-emerald-500/30 hover:scale-110 transition-all active:scale-95 z-20">
              +
            </button>
          </>
        )}

        {tela === "add" && (
          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-200">Nova Transacao</h2>
              <button onClick={() => setTela("dash")} className="text-gray-500 hover:text-gray-300">x</button>
            </div>
            <div className="flex gap-2">
              {(["despesa", "receita"] as const).map(t => (
                <button key={t} onClick={() => setForm(f => ({...f, tipo: t}))}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${form.tipo === t
                    ? (t === "receita" ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30" : "bg-red-500/20 text-red-400 ring-1 ring-red-500/30")
                    : "bg-gray-800 text-gray-500"}`}>
                  {t === "receita" ? "Receita" : "Despesa"}
                </button>
              ))}
            </div>
            <input type="text" placeholder="Nome" value={form.nome} onChange={e => setForm(f => ({...f, nome: e.target.value}))}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none" />
            <input type="number" placeholder="Valor" value={form.valor} onChange={e => setForm(f => ({...f, valor: e.target.value}))}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none" />
            <select value={form.categoria} onChange={e => setForm(f => ({...f, categoria: e.target.value}))}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-gray-800 border border-gray-700 text-gray-200 focus:border-emerald-500 focus:outline-none">
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={form.membro} onChange={e => setForm(f => ({...f, membro: e.target.value}))}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-gray-800 border border-gray-700 text-gray-200 focus:border-emerald-500 focus:outline-none">
              {MEMBROS.map(m => <option key={m.nome} value={m.nome}>{m.emoji} {m.nome}</option>)}
            </select>
            <label className="flex items-center gap-2 text-xs text-gray-400">
              <input type="checkbox" checked={form.recorrente} onChange={e => setForm(f => ({...f, recorrente: e.target.checked}))}
                className="rounded" />
              Recorrente
            </label>
            <button onClick={adicionar}
              className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg hover:shadow-emerald-500/30 transition-all active:scale-[0.98]">
              Adicionar
            </button>
          </div>
        )}

        {tela === "metas" && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-gray-300">Metas Financeiras</h2>
            {metas.map(m => {
              const pct = Math.round((m.atual / m.alvo) * 100)
              return (
                <div key={m.nome} className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-200">{m.nome}</span>
                    <span className="text-xs font-bold text-emerald-400">{pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
                    <div className={`h-full bg-gradient-to-r ${m.cor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>{fmt(m.atual)} de {fmt(m.alvo)}</span>
                    <span>Falta: {fmt(m.alvo - m.atual)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <p className="text-center text-[10px] text-gray-700 mt-6 pb-20">Family Finance - Synerium Factory</p>
      </div>
    </div>
  )
}
