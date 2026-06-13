import { useRef, useState } from 'react'
import { X, Download, Upload } from 'lucide-react'
import { exportData, importData } from '../api'

interface Props {
  onClose: () => void
  onImported: () => void
}

export default function BackupModal({ onClose, onImported }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const doExport = () => {
    const blob = new Blob([exportData()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const d = new Date()
    a.href = url
    a.download = `financas-backup-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    setErr(''); setMsg('Backup baixado. Guarde o arquivo num lugar seguro (e-mail, nuvem…).')
  }

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      importData(text)
      setErr(''); setMsg('')
      onImported()
    } catch (e) {
      setMsg(''); setErr(e instanceof Error ? e.message : 'Não foi possível importar.')
    } finally {
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <>
      <div className="anim-fade fixed inset-0 z-[100] bg-slate-900/30 backdrop-blur-sm" onClick={onClose} />
      <div className="anim-slide-up fixed inset-x-0 bottom-0 z-[101] mx-auto max-w-[560px] rounded-t-[2rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <span className="text-base font-bold text-slate-700">Backup dos dados</span>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 active:bg-slate-100"><X size={20} /></button>
        </div>

        <div className="space-y-3 px-5 py-5" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.25rem)' }}>
          <p className="text-sm text-slate-500">
            Seus dados ficam só neste aparelho. Faça um backup de vez em quando — e use
            o mesmo arquivo para passar tudo para outro celular.
          </p>

          <button onClick={doExport} className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 p-4 text-left active:bg-slate-100">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100"><Download size={20} className="text-emerald-600" /></span>
            <span>
              <span className="block text-sm font-bold text-slate-700">Exportar (salvar backup)</span>
              <span className="block text-xs text-slate-400">Baixa um arquivo com todos os seus dados.</span>
            </span>
          </button>

          <button onClick={() => fileRef.current?.click()} className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 p-4 text-left active:bg-slate-100">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-100"><Upload size={20} className="text-sky-600" /></span>
            <span>
              <span className="block text-sm font-bold text-slate-700">Importar (restaurar backup)</span>
              <span className="block text-xs text-slate-400">Substitui os dados atuais pelos do arquivo.</span>
            </span>
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onFile} />

          {msg && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm font-medium text-emerald-600">{msg}</div>}
          {err && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm font-medium text-rose-500">{err}</div>}
        </div>
      </div>
    </>
  )
}
