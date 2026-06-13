import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown, CalendarDays } from 'lucide-react'
import { getYear, getMonth } from '../api'
import type { YearData, Expense } from '../types'
import { money, monthName, cat, dayLabel } from '../format'

interface Props { refresh: number }

interface DayGroup { date: string; total: number; items: Expense[] }

function groupByDay(expenses: Expense[]): DayGroup[] {
  const map = new Map<string, DayGroup>()
  for (const e of expenses) {
    const key = e.date.slice(0, 10)
    let g = map.get(key)
    if (!g) { g = { date: e.date, total: 0, items: [] }; map.set(key, g) }
    g.total += e.amount
    g.items.push(e)
  }
  return [...map.values()].sort((a, b) => b.date.localeCompare(a.date))
}

export default function HistoryView({ refresh }: Props) {
  const [year, setYear] = useState(new Date().getFullYear())
  const [data, setData] = useState<YearData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [days, setDays] = useState<DayGroup[] | null>(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setExpanded(null)
    setDays(null)
    getYear(year)
      .then((d) => { if (alive) setData(d) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [year, refresh])

  const toggle = async (m: number) => {
    if (expanded === m) { setExpanded(null); setDays(null); return }
    setExpanded(m)
    setDays(null)
    const md = await getMonth(year, m)
    setDays(groupByDay(md.expenses))
  }

  const yearTotal = data?.yearTotal ?? 0
  const months = (data?.months ?? []).filter((m) => m.total > 0).reverse()

  return (
    <div>
      <header className="sticky top-0 z-30 flex items-center justify-between bg-white/70 px-4 py-3.5 backdrop-blur-xl">
        <button onClick={() => setYear((y) => y - 1)} className="grid h-10 w-10 place-items-center rounded-2xl text-slate-500 active:bg-slate-100"><ChevronLeft size={22} /></button>
        <span className="text-[1.05rem] font-bold text-slate-700">{year}</span>
        <button onClick={() => setYear((y) => y + 1)} className="grid h-10 w-10 place-items-center rounded-2xl text-slate-500 active:bg-slate-100"><ChevronRight size={22} /></button>
      </header>

      <div className="px-3">
        <div className="anim-pop relative overflow-hidden rounded-[1.75rem] p-6 text-center shadow-lg shadow-teal-200/50" style={{ background: 'linear-gradient(135deg,#c9eedd,#cfe9fb)' }}>
          <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/30 blur-2xl" />
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-600/80">Total do ano</p>
          <p className="mt-1 text-[2.5rem] font-extrabold leading-tight tracking-tight text-teal-900">{money(yearTotal)}</p>
        </div>

        <h2 className="mb-2 mt-6 px-1 text-[0.7rem] font-bold uppercase tracking-wider text-slate-400">Por mês</h2>

        {loading ? (
          <div className="py-10 text-center text-sm text-slate-400">Carregando…</div>
        ) : months.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <CalendarDays size={40} className="mx-auto text-slate-300" strokeWidth={1.6} />
            <p className="mt-3 text-sm font-medium">Nenhum gasto em {year}</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {months.map((mt) => {
              const open = expanded === mt.month
              return (
                <li key={mt.month} className="overflow-hidden rounded-3xl bg-white shadow-sm shadow-slate-200/70">
                  <button onClick={() => toggle(mt.month)} className="flex w-full items-center justify-between px-4 py-4">
                    <span className="font-bold capitalize text-slate-700">{monthName(mt.month)}</span>
                    <span className="flex items-center gap-2.5">
                      <span className="font-bold text-rose-400">{money(mt.total)}</span>
                      <ChevronDown size={18} className={`text-slate-300 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </span>
                  </button>

                  {open && (
                    <div className="border-t border-slate-100 bg-slate-50/60 px-3 pb-3">
                      {days === null ? (
                        <div className="py-4 text-center text-sm text-slate-400">Carregando…</div>
                      ) : (
                        days.map((g) => (
                          <div key={g.date}>
                            <div className="flex items-baseline justify-between px-1 pb-1.5 pt-3 text-xs font-bold text-slate-500">
                              <span className="capitalize">{dayLabel(g.date)}</span>
                              <span className="text-slate-400">{money(g.total)}</span>
                            </div>
                            <ul className="space-y-1.5">
                              {g.items.sort((a, b) => b.amount - a.amount).map((e) => {
                                const m = cat(e.category)
                                return (
                                  <li key={e.id} className="flex items-center gap-2.5 rounded-2xl bg-white p-2.5 shadow-sm shadow-slate-200/60">
                                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ background: m.tint }}>
                                      <m.Icon size={17} color={m.accent} strokeWidth={2.2} />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-baseline justify-between gap-2">
                                        <span className="truncate text-sm font-semibold text-slate-700">
                                          {e.description}
                                          {e.isFixed && <span className="ml-1.5 rounded-full bg-sky-100 px-1.5 py-0.5 text-[0.6rem] font-bold text-sky-500 align-middle">fixo</span>}
                                        </span>
                                        <span className="shrink-0 text-sm font-bold text-rose-400">-{money(e.amount)}</span>
                                      </div>
                                      <p className="text-[0.7rem] text-slate-400">{m.name}</p>
                                    </div>
                                  </li>
                                )
                              })}
                            </ul>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
