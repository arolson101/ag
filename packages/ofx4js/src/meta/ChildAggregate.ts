import { _default, PropertyDescriptor, PropertyDescriptorParams } from './PropertyDescriptor'

export interface ChildAggregateParams<T> extends PropertyDescriptorParams<T> {
  order: number
  name?: string
  required?: boolean
  collectionEntryType?: any
}

/**
 * Marks a method as providing a child aggregate (or set of them to a top-level aggregate).
 */
export class ChildAggregate extends PropertyDescriptor {
  private _name: string
  private _required: boolean
  private _order: number
  private _collectionEntryType: any

  constructor(params: ChildAggregateParams<any>) {
    super(params)
    this._order = params.order
    this._name = _default(params.name, '##not_specified##')
    this._required = _default(params.required, false)
    this._collectionEntryType = _default(params.collectionEntryType, null)
  }

  /**
   * Used to specify the name of the aggregate in its context as a child aggregate.
   *
   * @return Used to specify the name of the aggregate in its context as a child aggregate.
   */
  name(): string {
    return this._name
  }

  /**
   * Whether this aggregate is required.
   *
   * @return Whether this aggregate is required.
   */
  required(): boolean {
    return this._required
  }

  /**
   * The order this child aggregate comes in its parent aggregate.
   *
   * @return The order this child aggregate comes in its parent aggregate.
   */
  order(): number {
    return this._order
  }

  /**
   * If the type is a collection, return the type of the elements of the collection (otherwise null)
   */
  collectionEntryType(): any {
    return this._collectionEntryType
  }
}
