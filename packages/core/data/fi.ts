import { FinancialInstitution, FinancialInstitutionProfile } from 'filist'
import rawfilist from 'filist/filist.json'

export interface FI extends FinancialInstitution {
  id: number
}

const defined = (x: string | undefined | null): boolean => x !== undefined && x !== null && x !== ''

export const formatAddress = (fi: FI): string => {
  if (fi && fi.profile) {
    return [
      fi.profile.address1,
      fi.profile.address2,
      fi.profile.address3,

      [[fi.profile.city, fi.profile.state].filter(defined).join(', '), fi.profile.zip]
        .filter(defined)
        .join(' '),

      fi.profile.country,
    ]
      .filter(defined)
      .join('\n')
  } else {
    return ''
  }
}

const emptyprofile: FinancialInstitutionProfile = {
  address1: '',
  address2: '',
  address3: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  email: '',
  customerServicePhone: '',
  technicalSupportPhone: '',
  fax: '',
  financialInstitutionName: '',
  siteURL: '',
}

const emptyfi: FI = {
  id: 0,
  name: '(none)',
  fid: '',
  org: '',
  ofx: '',
  profile: emptyprofile,
}

const finalizeFilist = (list: FinancialInstitution[]): FI[] => [
  emptyfi,
  ...list.map((fi, index) => ({ ...fi, id: index + 1 })),
]

export const filist = finalizeFilist(rawfilist as FinancialInstitution[])
