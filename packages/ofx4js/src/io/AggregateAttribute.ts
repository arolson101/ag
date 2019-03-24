import { ok as assert } from 'assert'
import { SortedSet } from '../collections/SortedSet'
import { ChildAggregate } from '../meta/ChildAggregate'
import { Element } from '../meta/Element'
import { ReadMethod, WriteMethod } from '../meta/PropertyDescriptor'
import { OFXException } from '../OFXException'
import { AggregateInfo } from './AggregateInfo'
import { AggregateIntrospector } from './AggregateIntrospector'

export enum AggregateAttributeType {
  CHILD_AGGREGATE,
  ELEMENT,
}

/**
 * A generic descriptor for an attribute of an OFX aggregate.
 */
export class AggregateAttribute {
  private readMethod!: ReadMethod<any>
  private writeMethod!: WriteMethod<any>
  private attributeType: any
  private collectionEntryType: any
  private name?: string
  private order?: number
  private required?: boolean
  private type?: AggregateAttributeType
  private toString_?: string
  private collection?: boolean

  constructor(arg: Element | ChildAggregate) {
    if (arg instanceof Element) {
      this.AggregateAttributeFromElement(arg)
    } else if (arg instanceof ChildAggregate) {
      this.AggregateAttributeFromChildAggregate(arg)
    } else {
      throw new OFXException('invalid type')
    }
  }

  AggregateAttributeFromElement(elementInfo: Element) {
    this.readMethod = elementInfo.getReadMethod()
    this.writeMethod = elementInfo.getWriteMethod()
    if (this.readMethod == null) {
      throw new OFXException('Illegal property for aggregate: no read method.')
    } else if (this.writeMethod == null) {
      throw new OFXException('Illegal property for aggregate: no write method.')
    }

    this.attributeType = elementInfo.getPropertyType()
    this.collectionEntryType = null
    this.name = elementInfo.name()
    this.order = elementInfo.order()
    this.required = elementInfo.required()
    this.type = AggregateAttributeType.ELEMENT
    this.toString_ = "Element '" + this.name + "'"
    this.collection = false

    // todo: validate known/supported element types here?
  }

  AggregateAttributeFromChildAggregate(childAggregate: ChildAggregate) {
    this.readMethod = childAggregate.getReadMethod()
    this.writeMethod = childAggregate.getWriteMethod()
    if (this.readMethod == null) {
      throw new OFXException('Illegal property for aggregate: no read method.')
    } else if (this.writeMethod == null) {
      throw new OFXException('Illegal property for aggregate: no write method.')
    }

    this.attributeType = childAggregate.getPropertyType()
    this.collection = false
    if (childAggregate.collectionEntryType()) {
      this.collection = true
      this.name = undefined
      this.collectionEntryType = childAggregate.collectionEntryType()
    } else if ('##not_specified##' === childAggregate.name()) {
      const aggregateInfo = AggregateIntrospector.getAggregateInfo(this.attributeType)
      if (aggregateInfo == null) {
        throw new OFXException(
          "Illegal child aggregate type '" +
            childAggregate.getPropertyType() +
            "': no aggregate information available."
        )
      }

      this.name = aggregateInfo.getName()
      if ('##not_specified##' === this.name) {
        throw new OFXException(
          "Illegal child aggregate type '" +
            childAggregate.getPropertyType() +
            "': a child aggregate name must be specified."
        )
      }
      this.collectionEntryType = null
    } else {
      this.name = childAggregate.name()
      this.collectionEntryType = null
    }

    this.order = childAggregate.order()
    this.required = childAggregate.required()
    this.type = AggregateAttributeType.CHILD_AGGREGATE
    this.toString_ = "ChildAggregate '" + this.name + "'"
  }

  get(instance: object): /*throws Exception*/ any {
    let val = this.readMethod.call(instance)
    if (this.attributeType && val in this.attributeType) {
      val = this.attributeType[val]
    }
    return val
  }

  set(value: any, instance: object): /*throws Exception*/ void {
    if (this.collection) {
      let collection: object[] = this.get(instance)
      if (collection == null) {
        if (this.attributeType === SortedSet) {
          assert('contentCompare' in this.collectionEntryType)
          collection = new SortedSet((this.collectionEntryType as any).contentCompare) as any
        } else {
          collection = new this.attributeType()
        }
      }
      collection.push(value)
      value = collection
    }

    this.writeMethod.call(instance, value)
  }

  getAttributeType(): any {
    return this.attributeType
  }

  getArrayEntryType(): any {
    return this.collectionEntryType
  }

  getName(): string {
    return this.name!
  }

  isRequired(): boolean {
    return this.required!
  }

  getOrder(): number {
    return this.order!
  }

  getType(): AggregateAttributeType {
    return this.type!
  }

  static contentCompare(left: AggregateAttribute, right: AggregateAttribute): number {
    return left.order! - right.order!
  }

  //  public int compareTo(other: AggregateAttribute) {
  //    return this.order - other.order;
  //  }

  isArray(): boolean {
    return this.collection!
  }

  // @Override
  toString(): string {
    return this.toString_!
  }
}
