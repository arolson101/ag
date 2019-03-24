import { StringMap } from '../collections/collections'
import { SortedSet } from '../collections/SortedSet'
import { LOG } from '../log/Log'
import { OFXException } from '../OFXException'
import { AggregateAttribute, AggregateAttributeType } from './AggregateAttribute'
import { AggregateInfo, HeaderValues } from './AggregateInfo'
import { AggregateIntrospector } from './AggregateIntrospector'
import { DefaultStringConversion } from './DefaultStringConversion'
import { OFXWriter } from './OFXWriter'
import { StringConversion } from './StringConversion'

/**
 * Marshaller for aggregate objects.
 */
export class AggregateMarshaller {
  private conversion: StringConversion

  constructor() {
    this.conversion = new DefaultStringConversion()
  }

  /**
   * Marshal the specified aggregate object.
   *
   * @param aggregate The aggregate to marshal.
   * @param writer    The writer.
   */
  marshal(aggregate: object, writer: OFXWriter): /*throws IOException*/ void {
    const aggregateInfo = AggregateIntrospector.getAggregateInfo(aggregate.constructor)
    if (aggregateInfo == null) {
      throw new OFXException('Unable to marshal object (no aggregate metadata found).')
    }

    if (aggregateInfo.hasHeaders()) {
      const headerValues: HeaderValues = aggregateInfo.getHeaders(aggregate)
      const convertedValues: StringMap = {}
      for (const header of Object.keys(headerValues)) {
        convertedValues[header] = this.getConversion().toString(headerValues[header])
      }
      writer.writeHeaders(convertedValues)
    }

    writer.writeStartAggregate(aggregateInfo.getName())
    const AggregateAttributes: SortedSet<AggregateAttribute> = aggregateInfo.getAttributes()
    this.writeAggregateAttributes(aggregate, writer, AggregateAttributes)
    writer.writeEndAggregate(aggregateInfo.getName())
  }

  /**
   * Write the aggregate attributes for the specified aggregate.
   *
   * @param aggregate           The aggregate.
   * @param writer              The writer.
   * @param aggregateAttributes The aggregate attributes.
   */
  protected writeAggregateAttributes(
    aggregate: object,
    writer: OFXWriter,
    aggregateAttributes: SortedSet<AggregateAttribute>
  ): /*throws IOException*/ void {
    for (const aggregateAttribute of aggregateAttributes.values()) {
      let childValue: object | null = null
      try {
        childValue = aggregateAttribute.get(aggregate)
      } catch (e) {
        LOG.error('Unable to get ' + aggregateAttribute.toString() + '%o', e)
      }

      if (childValue != null) {
        switch (aggregateAttribute.getType()) {
          case AggregateAttributeType.CHILD_AGGREGATE:
            let childValues: object[]
            if (childValue instanceof Array) {
              childValues = childValue
            } else if (childValue instanceof SortedSet) {
              childValues = (childValue as SortedSet<object>).values()
            } else {
              childValues = [childValue]
            }

            for (const objValue of childValues) {
              const aggregateInfo = AggregateIntrospector.getAggregateInfo(objValue.constructor)
              if (aggregateInfo == null) {
                throw new OFXException(
                  'Unable to marshal object of type ' +
                    objValue.constructor.name +
                    ' (no aggregate metadata found).'
                )
              }

              let attributeName: string = aggregateAttribute.getName()
              if (aggregateAttribute.isArray()) {
                attributeName = aggregateInfo.getName()
              }

              writer.writeStartAggregate(attributeName)
              this.writeAggregateAttributes(objValue, writer, aggregateInfo.getAttributes())
              writer.writeEndAggregate(attributeName)
            }
            break
          case AggregateAttributeType.ELEMENT:
            const strValue: string = this.getConversion().toString(childValue)
            if (strValue != null && '' !== strValue.trim()) {
              writer.writeElement(aggregateAttribute.getName(), strValue)
            }
            break
          default:
            throw new OFXException(
              'Unknown aggregate attribute type: ' + aggregateAttribute.getType()
            )
        }
      } else if (aggregateAttribute.isRequired()) {
        throw new OFXException('Required ' + aggregateAttribute.toString() + ' is null or empty.')
      }
    }
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
