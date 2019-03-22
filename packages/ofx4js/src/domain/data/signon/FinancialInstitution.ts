import { Aggregate_add } from '../../../meta/Aggregate_Add'
import { Element_add } from '../../../meta/Element_add'

export class FinancialInstitutionInfo {
  private id: string
  private organization: string

  /**
   * Financial institution id.
   *
   * @return Financial institution id.
   */
  getId(): string {
    return this.id
  }

  /**
   * Financial institution id.
   *
   * @param id Financial institution id.
   */
  setId(id: string): void {
    this.id = id
  }

  /**
   * The organization.
   *
   * @return The organization.
   */
  getOrganization(): string {
    return this.organization
  }

  /**
   * The organization.
   *
   * @param organization The organization.
   */
  setOrganization(organization: string): void {
    this.organization = organization
  }
}

Aggregate_add(FinancialInstitutionInfo, 'FI')
Element_add(FinancialInstitutionInfo, {
  name: 'FID',
  order: 10,
  type: String,
  read: FinancialInstitutionInfo.prototype.getId,
  write: FinancialInstitutionInfo.prototype.setId,
})
Element_add(FinancialInstitutionInfo, {
  name: 'ORG',
  required: true,
  order: 0,
  type: String,
  read: FinancialInstitutionInfo.prototype.getOrganization,
  write: FinancialInstitutionInfo.prototype.setOrganization,
})
