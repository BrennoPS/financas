// On-device data store (no backend). All data lives in the phone's localStorage,
// so the app works fully offline once installed. Same function names the
// components already use, so nothing else needs to change.
import type { MonthData, YearData, Expense, NewExpense } from './types'

interface StoredExpense extends Expense {
  fixedEndDate: string | null
}

interface IncomeRow { year: number; month: number; amount: number }

interface DB {
  expenses: StoredExpense[]
  incomes: IncomeRow[]
  seq: number
}

const KEY = 'financecontrol.v1'

const pad = (n: number) => String(n).padStart(2, '0')
const isoDate = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`
const lastDay = (y: number, m: number) => new Date(y, m, 0).getDate()

function seed(): DB {
  const now = new Date()
  const start = isoDate(now.getFullYear(), now.getMonth() + 1, 15)
  const mk = (id: number, description: string, amount: number, category: number): StoredExpense =>
    ({ id, description, amount, category, date: start, isFixed: true, fixedEndDate: null })
  return {
    expenses: [
      mk(1, 'Paramount+', 18, 2),
      mk(2, 'Celular Claro', 30, 4),
      mk(3, 'Internet', 100, 4),
    ],
    incomes: [],
    seq: 4,
  }
}

function load(): DB {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as DB
  } catch { /* corrupt/missing -> reseed */ }
  const fresh = seed()
  save(fresh)
  return fresh
}

function save(db: DB) {
  localStorage.setItem(KEY, JSON.stringify(db))
}

// Best-effort: ask the browser to keep our data (reduces eviction on iOS/Safari)
if (typeof navigator !== 'undefined' && navigator.storage?.persist) {
  navigator.storage.persisted?.().then((p) => { if (!p) navigator.storage.persist?.() })
}

/** Concrete expense occurrences for a month (one-time in range + fixed expanded). */
function occurrencesForMonth(db: DB, year: number, month: number): Expense[] {
  const firstK = isoDate(year, month, 1)
  const lastK = isoDate(year, month, lastDay(year, month))
  const out: Expense[] = []

  for (const e of db.expenses) {
    const start = e.date.slice(0, 10)
    if (!e.isFixed) {
      if (start >= firstK && start <= lastK) {
        out.push({ id: e.id, description: e.description, amount: e.amount, category: e.category, date: start, isFixed: false })
      }
    } else {
      const end = e.fixedEndDate ? e.fixedEndDate.slice(0, 10) : null
      if (start <= lastK && (!end || end >= firstK)) {
        const startDay = Number(start.slice(8, 10))
        const day = Math.min(startDay, lastDay(year, month))
        out.push({ id: e.id, description: e.description, amount: e.amount, category: e.category, date: isoDate(year, month, day), isFixed: true })
      }
    }
  }
  return out
}

export async function getMonth(year: number, month: number): Promise<MonthData> {
  const db = load()
  const occ = occurrencesForMonth(db, year, month)
  occ.sort((a, b) => (b.date.localeCompare(a.date)) || (b.amount - a.amount))

  const byCat = new Map<number, number>()
  let total = 0
  for (const o of occ) {
    total += o.amount
    byCat.set(o.category, (byCat.get(o.category) ?? 0) + o.amount)
  }
  const categoryTotals = [...byCat.entries()]
    .map(([category, t]) => ({ category, total: t }))
    .sort((a, b) => b.total - a.total)

  const income = db.incomes.find((i) => i.year === year && i.month === month)?.amount ?? 0
  return { total, income, categoryTotals, expenses: occ }
}

export async function getYear(year: number): Promise<YearData> {
  const db = load()
  const months = []
  let yearTotal = 0
  for (let m = 1; m <= 12; m++) {
    const t = occurrencesForMonth(db, year, m).reduce((s, o) => s + o.amount, 0)
    months.push({ month: m, total: t })
    yearTotal += t
  }
  return { yearTotal, months }
}

export async function addExpense(payload: NewExpense): Promise<Expense> {
  const db = load()
  const e: StoredExpense = {
    id: db.seq++,
    description: payload.description,
    amount: payload.amount,
    category: payload.category,
    date: payload.date.slice(0, 10),
    isFixed: payload.isFixed,
    fixedEndDate: payload.fixedEndDate ? payload.fixedEndDate.slice(0, 10) : null,
  }
  db.expenses.push(e)
  save(db)
  return { id: e.id, description: e.description, amount: e.amount, category: e.category, date: e.date, isFixed: e.isFixed }
}

export async function deleteExpense(id: number): Promise<void> {
  const db = load()
  db.expenses = db.expenses.filter((e) => e.id !== id)
  save(db)
}

export async function setIncome(year: number, month: number, amount: number): Promise<{ amount: number }> {
  const db = load()
  const row = db.incomes.find((i) => i.year === year && i.month === month)
  if (row) row.amount = amount
  else db.incomes.push({ year, month, amount })
  save(db)
  return { amount }
}

// ─────────────────── Backup (export / import) ───────────────────

/** Full data as a pretty JSON string, for download. */
export function exportData(): string {
  return JSON.stringify(load(), null, 2)
}

/** Replace all data from a backup JSON string. Throws if the file is invalid. */
export function importData(text: string): void {
  const parsed = JSON.parse(text) as Partial<DB>
  if (!parsed || !Array.isArray(parsed.expenses) || !Array.isArray(parsed.incomes)) {
    throw new Error('Arquivo de backup inválido.')
  }
  const db: DB = {
    expenses: parsed.expenses as StoredExpense[],
    incomes: parsed.incomes as IncomeRow[],
    seq: typeof parsed.seq === 'number'
      ? parsed.seq
      : Math.max(0, ...(parsed.expenses as StoredExpense[]).map((e) => e.id)) + 1,
  }
  save(db)
}
