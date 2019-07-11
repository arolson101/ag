import { RRule } from 'rrule'

export class BillInput {
  name?: string
  group?: string
  web?: string
  icon?: string
  notes?: string
  amount?: number
  account?: string
  category?: string
  rrule?: RRule
  showAdvanced?: boolean
  sortOrder?: number
}
