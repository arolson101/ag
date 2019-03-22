import { ok as assert } from 'assert'
import { AggregateIntrospector } from '../io/AggregateIntrospector'
import { Element, ElementParams } from './Element'

export function Element_add<Type>(clazz: any, params: ElementParams<Type>): void {
  assert(params.type != null)
  AggregateIntrospector.addElement(clazz, new Element(params))
}
