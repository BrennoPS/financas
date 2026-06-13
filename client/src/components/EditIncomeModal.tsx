import { useState } from 'react'
import { X } from 'lucide-react'
import { setIncome } from '../api'
import { monthName } from '../format'

interface Props {
  year: number
  month: number
  current: number
  onClose: () => void
  onSaved: () => void
}

const inputCls =
  'w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-2xl font-extrabold text-slate-700 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100'

export default function EditIncomeModal({ year, month, current, onClose, onSaved }: Props) {
  const [amount, setAmount] = useState(current > 0 ? String(current) : '')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    const value = parseFloat(amount.replace(',', '.')) || 0
    setSaving(true)
    try {
      await setIncome(year, month, value)
      onSaved()
    } catch {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="anim-fade fixed inset-0 z-[100] bg-slate-900/30 backdrop-blur-sm" onClick={onClose} />
      <div className="anim-slide-up fixed inset-x-0 bottom-0 z-[101] mx-auto max-w-[560px] rounded-t-[2rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <span className="text-base font-bold text-slate-700">Receita de {monthName(month)}</span>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 active:bg-slate-100"><X size={20} /></button>
        </div>

        <div className="px-5 py-5">
          <label className="mb-1.5 block text-xs font-bold text-slate-500">Quanto entrou neste mês (R$)</label>
          <input
            type="number" inputMode="decimal" step="0.01" min="0" placeholder="0,00" autoFocus
            value={amount} onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') save() }}
            className={inputCls}
          />
          <p className="mt-2 text-xs text-slate-400">Você pode alterar a qualquer momento. Some salário, extras, etc.</p>
        </div>

        <div className="flex gap-2.5 border-t border-slate-100 px-5 py-4" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}>
          <button onClick={onClose} className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-500 active:bg-slate-50">Cancelar</button>
          <button onClick={save} disabled={saving} className="flex-[2] rounded-2xl py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition active:scale-[0.99] disabled:opacity-60" style={{ background: 'linear-gradient(135deg,#6cc8a0,#5bbfd0)' }}>
            {saving ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </div>
    </>
  )
}
