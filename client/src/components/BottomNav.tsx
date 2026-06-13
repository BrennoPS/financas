import { PieChart, CalendarDays, Settings } from 'lucide-react'
import type { ComponentType } from 'react'

export type Tab = 'month' | 'history'

type IconProps = { size?: number; strokeWidth?: number }
const tabs: { id: Tab; label: string; Icon: ComponentType<IconProps> }[] = [
  { id: 'month', label: 'Mês', Icon: PieChart },
  { id: 'history', label: 'Histórico', Icon: CalendarDays },
]

interface Props {
  tab: Tab
  onChange: (t: Tab) => void
  onBackup: () => void
}

export default function BottomNav({ tab, onChange, onBackup }: Props) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-w-[560px] border-t border-slate-200/70 bg-white/80 backdrop-blur-xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {tabs.map(({ id, label, Icon }) => {
        const active = tab === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.7rem] font-semibold transition-colors ${
              active ? 'text-rose-400' : 'text-slate-400'
            }`}
          >
            <span className={`transition-transform ${active ? '-translate-y-0.5' : ''}`}>
              <Icon size={22} strokeWidth={active ? 2.4 : 2} />
            </span>
            <span>{label}</span>
          </button>
        )
      })}
      <button
        onClick={onBackup}
        className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.7rem] font-semibold text-slate-400 transition-colors active:text-slate-600"
      >
        <span><Settings size={22} strokeWidth={2} /></span>
        <span>Ajustes</span>
      </button>
    </nav>
  )
}
