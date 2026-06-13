import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Trash2, Wallet, Pencil } from 'lucide-react'
import { getMonth, deleteExpense } from '../api'
import type { MonthData, Expense } from '../types'
import { money, cat, monthName, shortDate } from '../format'
import ConfirmDialog from './ConfirmDialog'
import EditIncomeModal from './EditIncomeModal'

interface Props {
  refresh: number
  onChanged: () => void
}

export default function MonthView({ refresh, onChanged }: Props) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [data, setData] = useState<MonthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [toDelete, setToDelete] = useState<Expense | null>(null)
  const [editingIncome, setEditingIncome] = useState(false)

  const load = useCallback(async () => {
    const d = await getMonth(year, month)
    setData(d)
    return d
  }, [year, month])

  useEffect(() => {
    let alive = true
    setLoading(true)
    getMonth(year, month)
      .then((d) => { if (alive) setData(d) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [year, month, refresh])

  const step = (delta: number) => {
    const d = new Date(year, month - 1 + delta, 1)
    setYear(d.getFullYear())
    setMonth(d.getMonth() + 1)
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    await deleteExpense(toDelete.id)
    setToDelete(null)
    await load()
    onChanged()
  }

  const total = data?.total ?? 0
  const income = data?.income ?? 0
  const balance = income - total
  const hasIncome = income > 0

  const hero = !hasIncome
    ? { bg: 'linear-gradient(135deg,#e2d6fb,#fbd5ea)', text: '#5b21b6', label: '#8b5cf6' }
    : balance >= 0
      ? { bg: 'linear-gradient(135deg,#c5edd6,#d3eef0)', text: '#06724e', label: '#10a06b' }
      : { bg: 'linear-gradient(135deg,#fbd3d8,#f8d9ea)', text: '#a83246', label: '#d05670' }

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-white/70 px-4 py-3.5 backdrop-blur-xl">
        <button onClick={() => step(-1)} className="grid h-10 w-10 place-items-center rounded-2xl text-slate-500 active:bg-slate-100"><ChevronLeft size={22} /></button>
        <span className="text-[1.05rem] font-bold capitalize text-slate-700">{monthName(month)} {year}</span>
        <button onClick={() => step(1)} className="grid h-10 w-10 place-items-center rounded-2xl text-slate-500 active:bg-slate-100"><ChevronRight size={22} /></button>
      </header>

      <div className="px-3">
        {/* Hero: balance (Sobrou) with income/expenses */}
        <div className="anim-pop relative overflow-hidden rounded-[1.75rem] p-6 text-center shadow-lg shadow-slate-200/60" style={{ background: hero.bg }}>
          <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/30 blur-2xl" />
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: hero.label }}>
            {hasIncome ? 'Sobrou no mês' : 'Total do mês'}
          </p>
          <p className="mt-1 text-[2.5rem] font-extrabold leading-tight tracking-tight" style={{ color: hero.text }}>
            {money(hasIncome ? balance : total)}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <button onClick={() => setEditingIncome(true)} className="flex items-center justify-between rounded-2xl bg-white/55 px-3.5 py-2.5 text-left transition active:bg-white/80">
              <span className="min-w-0">
                <span className="block text-[0.62rem] font-bold uppercase tracking-wide" style={{ color: hero.label }}>Entrou</span>
                <span className="block truncate text-sm font-extrabold" style={{ color: hero.text }}>{money(income)}</span>
              </span>
              <Pencil size={14} style={{ color: hero.label }} />
            </button>
            <div className="rounded-2xl bg-white/55 px-3.5 py-2.5">
              <span className="block text-[0.62rem] font-bold uppercase tracking-wide" style={{ color: hero.label }}>Saiu</span>
              <span className="block truncate text-sm font-extrabold" style={{ color: hero.text }}>{money(total)}</span>
            </div>
          </div>
        </div>

        {/* Category breakdown */}
        {data && data.categoryTotals.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {data.categoryTotals.map((c) => {
              const m = cat(c.category)
              const share = total > 0 ? Math.round((c.total / total) * 100) : 0
              return (
                <div key={c.category} className="rounded-3xl bg-white p-3.5 shadow-sm shadow-slate-200/70">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl" style={{ background: m.tint }}>
                      <m.Icon size={18} color={m.accent} strokeWidth={2.2} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-slate-400">{m.name}</p>
                      <p className="text-[0.95rem] font-bold text-slate-700">{money(c.total)}</p>
                    </div>
                  </div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full" style={{ width: `${share}%`, background: m.accent }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Expense list */}
        <h2 className="mb-2 mt-6 px-1 text-[0.7rem] font-bold uppercase tracking-wider text-slate-400">
          Gastos {data ? `· ${data.expenses.length}` : ''}
        </h2>

        {loading ? (
          <div className="py-10 text-center text-sm text-slate-400">Carregando…</div>
        ) : data && data.expenses.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Wallet size={40} className="mx-auto text-slate-300" strokeWidth={1.6} />
            <p className="mt-3 text-sm font-medium">Nenhum gasto este mês</p>
            <p className="text-xs text-slate-300">Toque no + para adicionar</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {data?.expenses.map((e) => {
              const m = cat(e.category)
              return (
                <li key={e.id} className="anim-fade flex items-center gap-3 rounded-3xl bg-white p-3 shadow-sm shadow-slate-200/70">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl" style={{ background: m.tint }}>
                    <m.Icon size={20} color={m.accent} strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate font-semibold text-slate-700">
                        {e.description}
                        {e.isFixed && <span className="ml-1.5 rounded-full bg-sky-100 px-1.5 py-0.5 text-[0.6rem] font-bold text-sky-500 align-middle">fixo</span>}
                      </span>
                      <span className="shrink-0 font-bold text-rose-400">-{money(e.amount)}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {e.isFixed ? `todo dia ${shortDate(e.date).slice(0, 2)}` : shortDate(e.date)} · {m.name}
                    </p>
                  </div>
                  <button onClick={() => setToDelete(e)} aria-label="Remover" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-300 active:bg-rose-50 active:text-rose-400"><Trash2 size={17} /></button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {toDelete && (
        <ConfirmDialog
          title={`Remover "${toDelete.description}"?`}
          note={toDelete.isFixed ? 'É um gasto fixo — será removido de todos os meses.' : undefined}
          confirmLabel="Remover"
          onCancel={() => setToDelete(null)}
          onConfirm={confirmDelete}
        />
      )}

      {editingIncome && (
        <EditIncomeModal
          year={year}
          month={month}
          current={income}
          onClose={() => setEditingIncome(false)}
          onSaved={async () => { setEditingIncome(false); await load() }}
        />
      )}
    </div>
  )
}
