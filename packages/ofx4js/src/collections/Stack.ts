export class Stack<T> {
  private values: T[]

  constructor() {
    this.values = []
  }

  push(...values: T[]): void {
    this.values.push(...values)
  }

  pop(): T {
    return Array.prototype.pop.call(this.values)
  }

  peek(): T {
    if (this.values.length === 0) {
      throw new Error('peek: empty stack')
    } else {
      return this.values[this.values.length - 1]
    }
  }

  isEmpty(): boolean {
    return this.values.length === 0
  }
}
