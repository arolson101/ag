import { ok as assert } from 'assert'

export type CompareFcn<T> = (a: T, b: T) => number

export class SortedSet<T> {
  private valueArray: T[]
  private compareFcn: CompareFcn<T>
  private isSorted?: boolean

  constructor(compareFcn: CompareFcn<T>) {
    this.valueArray = []
    this.compareFcn = compareFcn
  }

  values(): T[] {
    if (!this.isSorted) {
      assert(this.compareFcn)
      this.valueArray.sort(this.compareFcn)
      this.isSorted = true
    }
    return this.valueArray
  }

  insert(element: T): void {
    const index: number = this.valueArray.indexOf(element)
    if (index === -1) {
      this.isSorted = false
      this.valueArray.push(element)
    }
  }

  push(element: T): void {
    this.insert(element)
  }

  remove(element: T): boolean {
    const index: number = this.valueArray.indexOf(element)
    if (index === -1) {
      return false
    }
    this.valueArray = this.valueArray.splice(index, 1)
    return true
  }

  count(): number {
    return this.valueArray.length
  }
}
