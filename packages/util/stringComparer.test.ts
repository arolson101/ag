import { stringComparer } from './stringComparer'

test('stringComparer', () => {
  const unsorted = ['b', 'C', 'A', 'd']
  const sorted = ['A', 'b', 'C', 'd']
  unsorted.sort(stringComparer)
  expect(unsorted).toEqual(sorted)
})
