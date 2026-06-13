interface Props {
  title: string
  note?: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ title, note, confirmLabel, onConfirm, onCancel }: Props) {
  return (
    <>
      <div className="anim-fade fixed inset-0 z-[100] bg-slate-900/30 backdrop-blur-sm" onClick={onCancel} />
      <div className="anim-pop fixed left-1/2 top-1/2 z-[101] w-[min(340px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-[1.5rem] bg-white p-5 shadow-2xl">
        <p className="font-bold text-slate-700">{title}</p>
        {note && <p className="mt-1.5 text-sm font-medium text-amber-500">{note}</p>}
        <div className="mt-5 flex gap-2.5">
          <button onClick={onCancel} className="flex-1 rounded-2xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-500 active:bg-slate-50">
            Cancelar
          </button>
          <button onClick={onConfirm} className="flex-1 rounded-2xl bg-rose-400 py-2.5 text-sm font-bold text-white active:bg-rose-500">
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  )
}
