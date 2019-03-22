import { PropertyDescriptor, PropertyDescriptorParams } from './PropertyDescriptor'

export interface HeaderParams<T> extends PropertyDescriptorParams<T> {
  name: string
}

/**
 * An OFX element, applied to a javabean property.
 */
export class Header extends PropertyDescriptor {
  private _name: string

  constructor(params: HeaderParams<any>) {
    super(params)
    this._name = params.name
  }

  /**
   * The name of the element.
   *
   * @return The name of the element.
   */
  name(): string {
    return this._name
  }
}
