import { FinancialInstitution } from './FinancialInstitution'
import { FinancialInstitutionData } from './FinancialInstitutionData'

export interface FinancialInstitutionService {
  /**
   * Get the financial institution by the specified data.
   *
   * @param data The financial institution data.
   * @return The financial institution, or null if not found.
   */
  getFinancialInstitution(data: string | FinancialInstitutionData): FinancialInstitution
}
