import { ok as assert } from 'assert'
import { AnyMap } from '../collections/collections'
import { ChildAggregate } from '../meta/ChildAggregate'
import { Element } from '../meta/Element'
import { Header } from '../meta/Header'
import { AggregateInfo } from './AggregateInfo'

/**
 * Introspector for aggregate information.
 */
export class AggregateIntrospector {
  private static AGGREGATE_CLASSES_BY_NAME: AnyMap = {}
  private static placeholderName = '##PLACEHOLDER##'

  /**
   * Get the aggregate meta information for the specified class.
   *
   * @param clazz the aggregate class.
   * @return The aggregate meta information, or null if the class isn't an aggregate.
   */
  static getAggregateInfo(clazz: any): AggregateInfo {
    const aggregate: AggregateInfo = clazz.Aggregate
    if (aggregate != null && aggregate.getOwner() === clazz) {
      return aggregate
    } else {
      throw new Error('null aggregate')
    }
  }

  private static getAncestorAggregateInfo(clazz: () => any): AggregateInfo {
    // traverse inheritence hierarchy.  This is janky because of typescript's __extends
    // function, and may break in the future
    for (let proto = clazz.prototype; proto; proto = Object.getPrototypeOf(proto)) {
      if (proto.constructor && proto.constructor.Aggregate) {
        return proto.constructor.Aggregate
      }
    }
    throw new Error("didn't find class")
  }

  /**
   * Find the aggregate class by name.
   *
   * @param aggregateName The name of the aggregate.
   * @return The aggregate class.
   */
  static findAggregateByName(aggregateName: string): any {
    return AggregateIntrospector.AGGREGATE_CLASSES_BY_NAME[aggregateName]
  }

  static addAggregate(clazz: any, name: string) {
    AggregateIntrospector.AGGREGATE_CLASSES_BY_NAME[name] = clazz

    const aggregateInfo: AggregateInfo = AggregateIntrospector.getAggregateInfo(clazz)
    if (aggregateInfo) {
      assert(aggregateInfo.getName() === AggregateIntrospector.placeholderName)
      aggregateInfo.setName(name)
    } else {
      const parentInfo: AggregateInfo = AggregateIntrospector.getAncestorAggregateInfo(clazz)
      clazz.Aggregate = new AggregateInfo(name, clazz, parentInfo!)
    }
  }

  static addChildAggregate(clazz: any, childAggregate: ChildAggregate) {
    let aggregateInfo: AggregateInfo = AggregateIntrospector.getAggregateInfo(clazz)
    if (!aggregateInfo) {
      const parentInfo: AggregateInfo = AggregateIntrospector.getAncestorAggregateInfo(clazz)
      aggregateInfo = clazz.Aggregate = new AggregateInfo(
        AggregateIntrospector.placeholderName,
        clazz,
        parentInfo!
      )
    }
    assert(aggregateInfo != null)
    if (aggregateInfo) {
      aggregateInfo.addChildAggregate(childAggregate)
    }
  }

  static addElement(clazz: any, element: Element) {
    let aggregateInfo: AggregateInfo = AggregateIntrospector.getAggregateInfo(clazz)
    if (!aggregateInfo) {
      const parentInfo: AggregateInfo = AggregateIntrospector.getAncestorAggregateInfo(clazz)
      aggregateInfo = clazz.Aggregate = new AggregateInfo(
        AggregateIntrospector.placeholderName,
        clazz,
        parentInfo!
      )
    }
    assert(aggregateInfo != null)
    if (aggregateInfo) {
      aggregateInfo.addElement(element)
    }
  }

  static addHeader(clazz: any, header: Header) {
    let aggregateInfo = AggregateIntrospector.getAggregateInfo(clazz)
    if (!aggregateInfo) {
      const parentInfo: AggregateInfo = AggregateIntrospector.getAncestorAggregateInfo(clazz)
      aggregateInfo = clazz.Aggregate = new AggregateInfo(
        AggregateIntrospector.placeholderName,
        clazz,
        parentInfo!
      )
    }
    assert(aggregateInfo != null)
    if (aggregateInfo) {
      aggregateInfo.addHeader(header)
    }
  }
}
