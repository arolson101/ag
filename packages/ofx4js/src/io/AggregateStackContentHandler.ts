import { Stack } from '../collections/Stack'
import { LOG } from '../log/Log'
import { OFXException } from '../OFXException'
import { AggregateAttribute, AggregateAttributeType } from './AggregateAttribute'
import { AggregateInfo } from './AggregateInfo'
import { AggregateIntrospector } from './AggregateIntrospector'
import { OFXHandler } from './OFXHandler'
import { OFXSyntaxException } from './OFXSyntaxException'
import { StringConversion } from './StringConversion'

class AggregateInfoHolder {
  aggregate?: object
  info?: AggregateInfo
  aggregateName?: string
  currentAttributeIndex: number

  constructor(arg1: string | object, arg2?: AggregateInfo, arg3?: string) {
    this.currentAttributeIndex = 0
    switch (arguments.length) {
      case 1:
        this.AggregateInfoHolder1(arg1 as string)
        break

      case 3:
        this.AggregateInfoHolder3(arg1 as object, arg2!, arg3!)
        break

      default:
        throw new OFXException('invalid number of arguments')
    }
  }

  private AggregateInfoHolder1(ignoredAggregateName: string) {
    this.aggregate = undefined
    this.info = undefined
    this.aggregateName = ignoredAggregateName
  }

  private AggregateInfoHolder3(aggregate: object, info: AggregateInfo, aggregateName: string) {
    this.aggregateName = aggregateName
    this.aggregate = aggregate
    this.info = info
  }

  isBeingSkipped(): boolean {
    return this.aggregate == null || this.info == null
  }

  isSkipping(aggregateName: string): boolean {
    return this.isBeingSkipped() && aggregateName === this.aggregateName
  }
}

/**
 * Content handler that manages the aggregate using a stack-based implementation.
 */
export class AggregateStackContentHandler<A extends object> implements OFXHandler {
  private stack: Stack<AggregateInfoHolder> = new Stack<AggregateInfoHolder>()
  private conversion: StringConversion
  private parsingRoot: boolean = false

  constructor(root: A, conversion: StringConversion) {
    this.stack = new Stack<AggregateInfoHolder>()
    this.parsingRoot = false

    const aggregateInfo: AggregateInfo = AggregateIntrospector.getAggregateInfo(root.constructor)
    if (aggregateInfo == null) {
      throw new OFXException(
        "Unable to marshal object of type '" +
          root.constructor.name +
          "' (no aggregate metadata found)."
      )
    }

    this.stack.push(new AggregateInfoHolder(root, aggregateInfo, aggregateInfo.getName()))
    this.conversion = conversion
  }

  onHeader(name: string, value: string): void {
    const headerType: any = this.stack.peek().info!.getHeaderType(name)
    if (headerType != null) {
      this.stack
        .peek()
        .info!.setHeader(
          this.stack.peek().aggregate!,
          name,
          this.conversion.fromString(headerType, value)
        )
    }
  }

  onElement(name: string, value: string): void {
    if (!this.stack.peek().isBeingSkipped()) {
      const attribute: AggregateAttribute = this.stack
        .peek()
        .info!.getAttribute(name, this.stack.peek().currentAttributeIndex)
      if (attribute != null && attribute.getType() === AggregateAttributeType.ELEMENT) {
        try {
          attribute.set(
            this.conversion.fromString(attribute.getAttributeType(), value),
            this.stack.peek().aggregate!
          )
        } catch (e) {
          LOG.error('Unable to set ' + attribute.toString() + '%o', e)
        }
        this.stack.peek().currentAttributeIndex = attribute.getOrder()
      } else {
        LOG.info(
          'Element ' +
            name +
            ' is not supported on aggregate ' +
            this.stack.peek().info!.getName() +
            ' at index ' +
            this.stack.peek().currentAttributeIndex
        )
      }
    }
  }

  startAggregate(aggregateName: string): void {
    if (this.stack.peek().isBeingSkipped()) {
      this.stack.push(new AggregateInfoHolder(aggregateName))
    } else if (!this.parsingRoot) {
      if (aggregateName !== this.stack.peek().info!.getName()) {
        throw new OFXException('Unexpected root element: ' + aggregateName)
      }

      this.parsingRoot = true
    } else {
      let infoHolder: AggregateInfoHolder

      const attribute: AggregateAttribute = this.stack
        .peek()
        .info!.getAttribute(aggregateName, this.stack.peek().currentAttributeIndex)
      if (attribute != null) {
        if (attribute.getType() === AggregateAttributeType.CHILD_AGGREGATE) {
          let aggregateType: any
          // tslint:disable-next-line:prefer-conditional-expression
          if (attribute.isArray()) {
            aggregateType = AggregateIntrospector.findAggregateByName(aggregateName)
          } else {
            aggregateType = attribute.getAttributeType()
          }

          if (aggregateType != null) {
            const aggregateInfo: AggregateInfo = AggregateIntrospector.getAggregateInfo(
              aggregateType
            )
            if (aggregateInfo == null) {
              throw new OFXException(
                'Unable to locate aggregate info for type ' + aggregateType.getName()
              )
            }

            const aggregate = new aggregateType()
            infoHolder = new AggregateInfoHolder(aggregate, aggregateInfo, aggregateName)
          } else {
            LOG.info(
              'Child aggregate ' +
                aggregateName +
                ' is not supported on aggregate ' +
                this.stack.peek().info!.getName() +
                ': name not assigned a type.'
            )

            // element not supported.  push a skipping aggregate on the stack.
            infoHolder = new AggregateInfoHolder(aggregateName)
          }

          this.stack.peek().currentAttributeIndex = attribute.getOrder()
        } else {
          LOG.info(
            'Child aggregate ' +
              aggregateName +
              ' is not supported on aggregate ' +
              this.stack.peek().info!.getName() +
              ': no child aggregate, but there does exist an element by that name.'
          )

          // child aggregate not supported.  push a skipping aggregate on the stack.
          infoHolder = new AggregateInfoHolder(aggregateName)
        }
      } else {
        LOG.info(
          'Child aggregate ' +
            aggregateName +
            ' is not supported on aggregate ' +
            this.stack.peek().info!.getName() +
            ': no attributes found by that name after index ' +
            this.stack.peek().currentAttributeIndex
        )

        // child aggregate not supported.  push a skipping aggregate on the stack.
        infoHolder = new AggregateInfoHolder(aggregateName)
      }

      this.stack.push(infoHolder)
    }
  }

  endAggregate(aggregateName: string): void {
    const infoHolder: AggregateInfoHolder = this.stack.pop()
    if (aggregateName !== infoHolder.aggregateName) {
      throw new OFXSyntaxException(
        'Unexpected end aggregate ' +
          aggregateName +
          '. (Perhaps ' +
          infoHolder.aggregateName +
          ' is an element with an empty value, making it impossible to parse.)'
      )
    }

    if (!this.stack.isEmpty()) {
      if (!infoHolder.isSkipping(aggregateName)) {
        // we're not skipping the top aggregate, so process it.
        const attribute: AggregateAttribute = this.stack
          .peek()
          .info!.getAttribute(
            aggregateName,
            this.stack.peek().currentAttributeIndex,
            infoHolder.aggregate!.constructor
          )
        try {
          if (attribute != null) {
            attribute.set(infoHolder.aggregate, this.stack.peek().aggregate!)
          } else {
            LOG.info(
              'Child aggregate ' +
                aggregateName +
                ' is not supported on aggregate ' +
                this.stack.peek().info!.getName() +
                ': no attributes found by that name after index ' +
                this.stack.peek().currentAttributeIndex
            )
          }
        } catch (e) {
          LOG.error('Unable to set ' + attribute.toString() + '%o', e)
        }
        if (attribute != null) {
          this.stack.peek().currentAttributeIndex = attribute.getOrder()
        }
      }
    } else {
      // ended the root element.
    }
  }
}
