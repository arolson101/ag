import { Record } from './Record'

interface TestRecordProps {
  foo: string
  bar: number
}

class TestRecord extends Record<TestRecordProps> implements TestRecordProps {
  foo!: string
  bar!: number

  constructor(props?: TestRecordProps) {
    super(props)
  }
}

it('accumulates changes', () => {
  const test = new TestRecord({ foo: 'foo', bar: 123 })
  expect(test).not.toHaveProperty('id')
  expect(test).toHaveProperty('_base')
  expect(test).toHaveProperty('_history')
  expect(test.foo).toBe('foo')
  expect(test.bar).toBe(123)

  const test2 = Record.update(TestRecord, test, 1, { foo: { $set: 'test2' } })
  expect(test2).not.toBe(test)
  expect(test.foo).toBe('foo')
  expect(test2.foo).toBe('test2')
  expect(test2.bar).toBe(123)

  const test3 = Record.update(TestRecord, test2, 2, {
    foo: { $set: 'test3' },
    bar: { $set: 234 },
  })
  expect(test3.foo).toBe('test3')
  expect(test3.bar).toBe(234)
})

it('keeps the latest change when a conflict occurrs', () => {
  const test = new TestRecord({ foo: 'foo', bar: 123 })
  const test2 = Record.update(TestRecord, test, 20, { foo: { $set: 'test2' } })
  const test3 = Record.update(TestRecord, test2, 10, { foo: { $set: 'test3' } })
  expect(test3).toHaveProperty('foo', 'test2')
})
