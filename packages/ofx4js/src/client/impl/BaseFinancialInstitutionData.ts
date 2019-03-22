import { FinancialInstitutionData } from '../FinancialInstitutionData'

// import java.net.URL;

/**
 * Base bean for FI data.
 */
export class BaseFinancialInstitutionData implements FinancialInstitutionData {
  private id: string
  private fid: string
  private name: string
  private organization: string
  private ofxUrl: string
  private brokerId: string

  constructor(id?: string) {
    this.id = id
  }

  getId(): string {
    return this.id
  }

  setId(id: string): void {
    this.id = id
  }

  getFinancialInstitutionId(): string {
    return this.fid
  }

  setFinancialInstitutionId(id: string): void {
    this.fid = id
  }

  getName(): string {
    return this.name
  }

  setName(name: string): void {
    this.name = name
  }

  getOrganization(): string {
    return this.organization
  }

  setOrganization(organization: string): void {
    this.organization = organization
  }

  getOFXURL(): string {
    return this.ofxUrl
  }

  setOFXURL(OFXURL: string): void {
    this.ofxUrl = OFXURL
  }

  getBrokerId(): string {
    return this.brokerId
  }

  setBrokerId(brokerId: string): void {
    this.brokerId = brokerId
  }
}
