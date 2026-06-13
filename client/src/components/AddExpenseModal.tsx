import { useState } from 'react'
import { X } from 'lucide-react'
import { addExpense } from '../api'
import { CATEGORIES } from '../format'

interface Props {
  onClose: () => void
  onAdded: () => void
}

function todayISO(): string {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

/** "yyyy-MM" -> ISO date of the last day of that month */
function endOfMonthISO(ym: string): string | null {
  const [y, m] = ym.split('-').map(Number)
  if (!y || !m) return null
  const last = new Date(y, m, 0).getDate()
  return `${y}-${String(m).padStart(2, '0')}-${String(last).padStart(2, '0')}`
}

const inputCls =
  'w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-base text-slate-700 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-100'

export default function AddExpenseModal({ onClose, onAdded }: Props) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(0)
  const [date, setDate] = useState(todayISO())
  const [isFixed, setIsFixed] = useState(false)
  const [endMonth, setEndMonth] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    setError('')
    const value = parseFloat(amount.replace(',', '.'))
    if (!value || value <= 0) { setError('Informe um valor maior que zero.'); return }
    if (!description.trim()) { setError('Informe uma descrição.'); return }

    setSaving(true)
    try {
      await addExpense({
        description: description.trim(),
        amount: value,
        category,
        date,
        isFixed,
        fixedEndDate: isFixed && endMonth ? endOfMonthISO(endMonth) : null,
      })
      onAdded()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar.')
      setSaving(false)
    }
  }

  return (
    <>
      <div className="anim-fade fixed inset-0 z-[100] bg-slate-900/30 backdrop-blur-sm" onClick={onClose} />
      <div className="anim-slide-up fixed inset-x-0 bottom-0 z-[101] mx-auto max-h-[92vh] max-w-[560px] overflow-y-auto rounded-t-[2rem] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <span className="text-base font-bold text-slate-700">Novo gasto</span>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 active:bg-slate-100"><X size={20} /></button>
        </div>

        <div className="space-y-5 px-5 py-5">
          {/* Amount */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500">Valor (R$) *</label>
            <input
              type="number" inputMode="decimal" step="0.01" min="0" placeholder="0,00"
              value={amount} onChange={(e) => setAmount(e.target.value)}
              className={`${inputCls} text-2xl font-extrabold`}
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500">Descrição *</label>
            <input
              type="text" maxLength={100} placeholder="Ex: Luz, Internet, Mercado…"
              value={description} onChange={(e) => setDescription(e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500">Categoria</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const on = category === c.id
                return (
                  <button
                    key={c.id} onClick={() => setCategory(c.id)}
                    className="flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium transition"
                    style={on
                      ? { background: c.tint, borderColor: c.accent, color: '#475569' }
                      : { background: '#fff', borderColor: '#e7e9f0', color: '#94a0b3' }}
                  >
                    <c.Icon size={16} color={c.accent} strokeWidth={2.2} />{c.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-500">Data</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
          </div>

          {/* Fixed toggle */}
          <label className="flex items-center justify-between rounded-2xl bg-slate-50 p-3.5">
            <span className="text-sm font-medium text-slate-600">Gasto fixo (repete todo mês)</span>
            <input
              type="checkbox" checked={isFixed} onChange={(e) => setIsFixed(e.target.checked)}
              className="h-5 w-5 accent-violet-400"
            />
          </label>

          {isFixed && (
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-500">Repetir até (mês/ano)</label>
              <input type="month" value={endMonth} onChange={(e) => setEndMonth(e.target.value)} className={inputCls} />
              <p className="mt-1 text-xs text-slate-400">Deixe em branco para repetir sem limite.</p>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm font-medium text-rose-500">{error}</div>
          )}
        </div>

        <div className="sticky bottom-0 flex gap-2.5 border-t border-slate-100 bg-white px-5 py-4" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}>
          <button onClick={onClose} className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-500 active:bg-slate-50">Cancelar</button>
          <button onClick={submit} disabled={saving} className="flex-[2] rounded-2xl py-3 text-sm font-bold text-white shadow-lg shadow-rose-200 transition active:scale-[0.99] disabled:opacity-60" style={{ background: 'linear-gradient(135deg,#f7a5a0,#f3a8cf)' }}>
            {saving ? 'Salvando…' : 'Adicionar'}
          </button>
        </div>
      </div>
    </>
  )
}
