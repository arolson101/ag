import { updateRecord, Record } from './Record'

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

test('updateRecord', () => {
  const test = new TestRecord({ foo: 'foo', bar: 123 })
  expect(test.foo).toBe('foo')
  expect(test.bar).toBe(123)

  const test2 = Record.update(TestRecord, test, { foo: { $set: 'foo2' } })
  expect(test2).not.toBe(test2)
  expect(test.foo).toBe('foo')
  expect(test2.foo).toBe('foo2')
  expect(test2.bar).toBe(123)

  const test3 = Record.update(TestRecord, test, { foo: { $set: 'foo3' }, bar: { $set: 234 } })
  expect(test3.foo).toBe('foo3')
  expect(test3.bar).toBe(234)

  const bank1: Bank = createRecord(() => 'abc123', { name: '1st bank' })
  expect(bank1).toHaveProperty('id')
  expect(bank1).toHaveProperty('_base')
  expect(bank1).toHaveProperty('_history')

  // simple update
  const bank2 = updateRecord<Bank, Bank.Props>(bank1, { t: 20, q: { name: { $set: '2nd bank' } } })
  expect(bank2).toHaveProperty('name', '2nd bank')

  // conflicting change
  const bank3 = updateRecord<Bank, Bank.Props>(bank2, { t: 10, q: { name: { $set: '3rd bank' } } })
  expect(bank3).toHaveProperty('name', '2nd bank')
})
