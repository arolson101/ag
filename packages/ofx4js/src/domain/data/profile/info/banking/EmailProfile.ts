import { Aggregate_add } from '../../../../../meta/Aggregate_Add'
import { Element_add } from '../../../../../meta/Element_add'

/**
 * @see "Section 11.13.2.3 OFX Spec"
 */
export class EmailProfile {
  private canEmail!: boolean
  private canNotify!: boolean

  getCanEmail(): boolean {
    return this.canEmail
  }

  setCanEmail(canEmail: boolean): void {
    this.canEmail = canEmail
  }

  getCanNotify(): boolean {
    return this.canNotify
  }

  setCanNotify(canNotify: boolean): void {
    this.canNotify = canNotify
  }
}

Aggregate_add(EmailProfile, 'EMAILPROF')
Element_add(EmailProfile, {
  name: 'CANEMAIL',
  required: true,
  order: 10,
  type: Boolean,
  read: EmailProfile.prototype.getCanEmail,
  write: EmailProfile.prototype.setCanEmail,
})
Element_add(EmailProfile, {
  name: 'CANNOTIFY',
  required: true,
  order: 20,
  type: Boolean,
  read: EmailProfile.prototype.getCanNotify,
  write: EmailProfile.prototype.setCanNotify,
})
