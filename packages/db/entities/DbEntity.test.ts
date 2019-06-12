import { DbEntity } from './DbEntity'

interface TestDbEntityProps {
  foo: string
  bar: number
}

class TestDbEntity extends DbEntity<TestDbEntityProps> implements TestDbEntityProps {
  foo!: string
  bar!: number

  constructor(props?: TestDbEntityProps) {
    super(undefined, props)
  }
}

it('accumulates changes', () => {
  const test = new TestDbEntity({ foo: 'test1', bar: 123 })
  expect(test).toHaveProperty('id', undefined)
  expect(test).not.toHaveProperty('_base')
  expect(test).toHaveProperty('_history')
  expect(test.foo).toBe('test1')
  expect(test.bar).toBe(123)

  test.update(1, { foo: { $set: 'test2' } })
  expect(test.foo).toBe('test2')
  expect(test.bar).toBe(123)

  test.update(2, {
    foo: { $set: 'test3' },
    bar: { $plus: 10 },
  })
  expect(test.foo).toBe('test3')
  expect(test.bar).toBe(133)
})

it('keeps the latest change when a conflict occurrs', () => {
  const test = new TestDbEntity({ foo: 'foo', bar: 123 })
  test.update(20, { foo: { $set: 'test2' } })
  test.update(10, { foo: { $set: 'test3' } })
  expect(test).toHaveProperty('foo', 'test2')
})

it('marks object for delete', () => {
  const test = new TestDbEntity({ foo: 'foo', bar: 123 })
  expect(test.isDeleted()).toBe(false)
  test.delete(20)
  expect(test.isDeleted()).toBe(true)
  test.update(10, { foo: { $set: 'test3' } })
  expect(test.isDeleted()).toBe(true)
  expect(test).toHaveProperty('_deleted', 20)
})
