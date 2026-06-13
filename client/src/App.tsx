import { useState } from 'react'
import { Plus } from 'lucide-react'
import MonthView from './components/MonthView'
import HistoryView from './components/HistoryView'
import AddExpenseModal from './components/AddExpenseModal'
import BackupModal from './components/BackupModal'
import BottomNav, { type Tab } from './components/BottomNav'

export default function App() {
  const [tab, setTab] = useState<Tab>('month')
  const [adding, setAdding] = useState(false)
  const [backup, setBackup] = useState(false)
  const [refresh, setRefresh] = useState(0)

  const bump = () => setRefresh((r) => r + 1)

  const handleAdded = () => {
    setAdding(false)
    bump()
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[560px] flex-col">
      <main className="flex-1 pb-28">
        {tab === 'month'
          ? <MonthView refresh={refresh} onChanged={bump} />
          : <HistoryView refresh={refresh} />}
      </main>

      {tab === 'month' && (
        <button
          onClick={() => setAdding(true)}
          aria-label="Adicionar gasto"
          className="fixed bottom-24 right-5 z-40 grid place-items-center rounded-full text-white shadow-lg shadow-rose-300/50 transition active:scale-90"
          style={{ height: 58, width: 58, background: 'linear-gradient(135deg,#f7a5a0,#f3a8cf)' }}
        >
          <Plus size={26} strokeWidth={2.4} />
        </button>
      )}

      <BottomNav tab={tab} onChange={setTab} onBackup={() => setBackup(true)} />

      {adding && (
        <AddExpenseModal onClose={() => setAdding(false)} onAdded={handleAdded} />
      )}

      {backup && (
        <BackupModal onClose={() => setBackup(false)} onImported={() => { setBackup(false); bump() }} />
      )}
    </div>
  )
}
