export interface Expense {
  id: number
  description: string
  amount: number
  category: number
  date: string        // ISO date
  isFixed: boolean
}

export interface CategoryTotal {
  category: number
  total: number
}

export interface MonthData {
  total: number
  income: number
  categoryTotals: CategoryTotal[]
  expenses: Expense[]
}

export interface MonthTotal {
  month: number
  total: number
}

export interface YearData {
  yearTotal: number
  months: MonthTotal[]
}

export interface NewExpense {
  description: string
  amount: number
  category: number
  date: string
  isFixed: boolean
  fixedEndDate: string | null
}
