import * as assert from 'assert'
import { AggregateIntrospector } from '../io/AggregateIntrospector'
import { Header, HeaderParams } from './Header'

export function Header_add<Type>(clazz: any, params: HeaderParams<Type>): void {
  assert.ok(params.type != null)
  AggregateIntrospector.addHeader(clazz, new Header(params))
}
