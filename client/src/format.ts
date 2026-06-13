import type { ComponentType } from 'react'
import { Utensils, ShoppingCart, MonitorPlay, Gamepad2, Receipt, Wallet, TrendingUp } from 'lucide-react'

type IconProps = { size?: number; className?: string; strokeWidth?: number; color?: string }
export type IconComponent = ComponentType<IconProps>

export interface CategoryMeta {
  id: number
  name: string
  Icon: IconComponent
  accent: string   // icon + progress-bar color
  tint: string     // soft bubble background
}

// Soft pastel palette
export const CATEGORIES: CategoryMeta[] = [
  { id: 0, name: 'Restaurante', Icon: Utensils,     accent: '#ec9a76', tint: '#fcebe1' },
  { id: 1, name: 'Mercado',     Icon: ShoppingCart, accent: '#69c39c', tint: '#e6f4ed' },
  { id: 2, name: 'Assinaturas', Icon: MonitorPlay,  accent: '#74a8e6', tint: '#e8f1fc' },
  { id: 3, name: 'Jogos',       Icon: Gamepad2,     accent: '#a995dd', tint: '#eee9f9' },
  { id: 4, name: 'Contas',      Icon: Receipt,      accent: '#e0b15f', tint: '#fbf2de' },
  { id: 5, name: 'Outros',      Icon: Wallet,       accent: '#9aa4b6', tint: '#eef0f5' },
  { id: 6, name: 'Investimentos', Icon: TrendingUp, accent: '#46b2a6', tint: '#e0f2f0' },
]

export const cat = (id: number): CategoryMeta => CATEGORIES[id] ?? CATEGORIES[5]

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
export const money = (v: number) => brl.format(v)

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
export const monthName = (m: number) => MONTHS[m - 1] ?? ''

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// Parse "YYYY-MM-DD..." as a LOCAL date (avoids the UTC off-by-one in BRT).
function parseLocal(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return { y, m, d, dow: new Date(y, m - 1, d).getDay() }
}

/** "Sex, 13/06" from an ISO date string */
export function dayLabel(iso: string): string {
  const { m, d, dow } = parseLocal(iso)
  return `${WEEKDAYS[dow]}, ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`
}

/** "13/06" from an ISO date string */
export function shortDate(iso: string): string {
  const { m, d } = parseLocal(iso)
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`
}

/** Day-of-month (number) from an ISO date string */
export const dayOf = (iso: string) => parseLocal(iso).d
