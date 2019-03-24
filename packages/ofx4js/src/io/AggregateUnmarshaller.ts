import { AggregateStackContentHandler } from './AggregateStackContentHandler'
import { BaseOFXReader } from './BaseOFXReader'
import { DefaultStringConversion } from './DefaultStringConversion'
import { OFXReader } from './OFXReader'
import { StringConversion } from './StringConversion'
import { StringReader } from './StringReader'

/**
 * Unmarshaller for aggregate objects.
 */
export class AggregateUnmarshaller<A extends object> {
  private clazz: any
  private conversion: StringConversion

  constructor(clazz: new () => A) {
    this.clazz = clazz
    this.conversion = new DefaultStringConversion()
  }

  unmarshal(arg: StringReader | string): A {
    const stream: StringReader =
      (arg as any) instanceof StringReader ? (arg as StringReader) : new StringReader(arg as string)
    const aggregate: A = new this.clazz()
    const reader: OFXReader = this.newReader()
    reader.setContentHandler(new AggregateStackContentHandler<A>(aggregate, this.getConversion()))
    reader.parse(stream)
    return aggregate
  }

  /**
   * New OFX reader.
   *
   * @return new OFX reader.
   */
  protected newReader(): OFXReader {
    return new BaseOFXReader()
  }

  /**
   * The conversion.
   *
   * @return The conversion.
   */
  getConversion(): StringConversion {
    return this.conversion
  }

  /**
   * The conversion.
   *
   * @param conversion The conversion.
   */
  setConversion(conversion: StringConversion): void {
    this.conversion = conversion
  }
}
