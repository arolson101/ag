export class OutputBuffer {
  private data: string[]

  constructor() {
    this.data = []
  }

  toString(encoding?: string): string {
    return this.data.join('')
  }

  append(data: string): void {
    this.data.push(data)
  }

  size(): number {
    return this.data.reduce((previousValue: number, currentValue: string): number => {
      return currentValue.length
    }, 0)
  }
}

export class StreamWriter {
  private out: OutputBuffer
  private encoding: string

  constructor(out: OutputBuffer, encoding: string) {
    this.out = out
    this.encoding = encoding
  }

  flush(): void {}

  close(): void {}

  write(data: string): void {
    this.out.append(data)
    // TODO
    // Array.prototype.push.apply(this.out, data.split(''));
  }
}
