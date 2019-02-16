import css, { Declaration, Rule } from 'css'
import debug from 'debug'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { ImageProperties, ImageURISource, StyleProp, View, ViewStyle } from 'react-native'
import * as rnsvg from 'react-native-svg'
// tslint:disable-next-line:no-duplicate-imports
import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  Polyline,
  RadialGradient,
  Rect,
  Stop,
  Text,
  TSpan,
  Use,
} from 'react-native-svg'
import xmldom from 'xmldom'

const log = debug('rn:react-native-svg-uri')

interface SvgUriProps {
  /**
   * The width of the rendered svg
   */
  width?: number | string

  /**
   * The height of the rendered svg
   */
  height?: number | string

  /**
   * Source path for the .svg file
   * Expects a require('path') to the file or object with uri.
   * e.g. source={require('my-path')}
   * e.g. source={{uri: 'my-path'}}
   */
  source: ImageURISource

  /**
   * Fill color for the svg object
   */
  fill?: string

  /**
   * Style properties for the containing View
   */
  style?: StyleProp<ViewStyle>

  fetcher: typeof fetch
}

interface State {
  doc?: Document
  text?: string
}

export class SvgUri extends Component<SvgUriProps, State> {
  static propTypes = {
    style: PropTypes.object,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    svgXmlData: PropTypes.string,
    source: PropTypes.any,
    fill: PropTypes.string,
    onLoad: PropTypes.func,
    fillAll: PropTypes.bool,
  }

  private controller?: AbortController
  state: State = { doc: undefined }

  async componentDidMount() {
    const { source } = this.props
    this.load(source.uri)
  }

  async componentDidUpdate(prevProps: SvgUriProps) {
    const { source } = this.props
    if (source.uri !== prevProps.source.uri) {
      this.load(source.uri)
    }
  }

  async load(uri: string | undefined) {
    if (this.controller) {
      this.controller.abort()
    }
    this.controller = new AbortController()

    if (!uri) {
      this.setState({ text: undefined, doc: undefined })
    } else {
      const { fetcher } = this.props
      const data = await fetcher(uri, { signal: this.controller.signal })
      if (data) {
        const text = await data.text()
        const doc = new xmldom.DOMParser().parseFromString(text)
        if (doc) {
          this.setState({ doc, text })
        } else {
          log('no document from string %s', text)
        }
      } else {
        log('no data from uri %s', uri)
      }
    }
  }

  componentWillUnmount() {
    if (this.controller) {
      this.controller.abort()
    }
  }

  render() {
    const { doc } = this.state
    if (doc == null) {
      return null
    }

    const overrideSvgProps = {
      width: this.props.width,
      height: this.props.height,
      fill: this.props.fill,
    }

    return (
      <View style={this.props.style}>{renderNode(overrideSvgProps, 'root', {}, doc as any)}</View>
    )
  }
}

type NodeProps = Record<string, React.ReactText>
type Styles = Record<string, NodeProps>

const parseStyles = (node: Element): Styles => {
  const res = css.parse(node.textContent || '', { silent: true })
  const styles = {} as Styles
  if (res && res.stylesheet && res.stylesheet.rules) {
    for (const rule of res.stylesheet.rules) {
      switch (rule.type) {
        case 'rule':
          {
            const r = rule as Rule
            const style = {} as NodeProps
            for (const declaration of r.declarations || []) {
              if (declaration.type === 'declaration') {
                const d = declaration as Declaration
                if (d.property && d.value) {
                  style[d.property] = d.value
                }
              }
            }

            for (const selector of r.selectors || []) {
              if (selector.startsWith('.')) {
                // log('style %s = %o', selector, style)
                styles[selector.substr(1)] = style
              }
            }
          }
          break

        default:
          log('unknown rule type %s %o', rule.type, rule)
      }
    }
  }

  log('parseStyles %o', styles)
  return styles
}

const stringAttribute = (node: Element, attr: string): string | undefined => {
  if (node.hasAttribute(attr)) {
    return node.getAttribute(attr) as string
  }
}

const requiredStringAttribute = (node: Element, attr: string): string => {
  const value = stringAttribute(node, attr)
  if (!value) {
    throw new Error(`required attribute '${attr}' was not present`)
  }
  return value
}

const hrefAttribute = (node: Element): ImageProperties['source'] | undefined => {
  return stringAttribute(node, 'href') || (stringAttribute(node, 'xlink:href') as any)
}

const requiredHrefAttribute = (node: Element): ImageProperties['source'] => {
  const value = hrefAttribute(node)
  if (!value) {
    throw new Error(`required attribute 'href' was not present`)
  }
  return value
}

type NumberProp = string | number
const numericAttribute = (node: Element, attr: string): NumberProp | undefined => {
  if (node.hasAttribute(attr)) {
    return node.getAttribute(attr) as string
  }
}

const numericOrArrayAttribute = (node: Element, attr: string): number | number[] | undefined => {
  const str = stringAttribute(node, attr)
  if (str) {
    const arr = str.split(/(,| )/g).map(parseFloat)
    if (arr.length === 1) {
      return arr[0]
    } else {
      return arr
    }
  }
}

const filter = <T extends { [key: string]: any }>(o: T): T => {
  return Object.keys(o)
    .filter(key => typeof o[key] !== 'undefined')
    .reduce(
      (res, key) => {
        res[key] = o[key]
        return res
      },
      {} as T
    )
}

const fillProps = (node: Element): rnsvg.FillProps =>
  filter({
    fill: stringAttribute(node, 'fill'),
    fillOpacity: numericAttribute(node, 'fill-opacity'),
    fillRule: stringAttribute(node, 'fill-rule') as rnsvg.FillRule,
  })

const clipProps = (node: Element): rnsvg.ClipProps =>
  filter({
    clipRule: stringAttribute(node, 'clip-rule') as rnsvg.FillRule,
    clipPath: stringAttribute(node, 'clip-path'),
  })

const definitionProps = (node: Element): rnsvg.DefinitionProps =>
  filter({
    id: stringAttribute(node, 'id'),
  })

const strokeProps = (node: Element): rnsvg.StrokeProps =>
  filter({
    stroke: stringAttribute(node, 'stroke'),
    strokeWidth: numericAttribute(node, 'stroke-width'),
    strokeOpacity: numericAttribute(node, 'stroke-opacity'),
    strokeDasharray: numericOrArrayAttribute(node, 'stroke-dasharray'),
    strokeDashoffset: numericAttribute(node, 'stroke-dashoffset'),
    strokeLinecap: stringAttribute(node, 'stroke-linecap') as rnsvg.Linecap,
    strokeLinejoin: stringAttribute(node, 'stroke-linejoin') as rnsvg.Linejoin,
    strokeMiterlimit: numericAttribute(node, 'stroke-miterlimit'),
  })

const fontObject = (node: Element): rnsvg.FontObject =>
  filter({
    fontStyle: stringAttribute(node, 'font-style') as rnsvg.FontStyle,
    fontVariant: stringAttribute(node, 'font-variant') as rnsvg.FontVariant,
    fontWeight: stringAttribute(node, 'font-weight') as rnsvg.FontWeight,
    fontStretch: stringAttribute(node, 'font-stretch') as rnsvg.FontStretch,
    fontSize: numericAttribute(node, 'font-size'),
    fontFamily: stringAttribute(node, 'font-family'),
    textAnchor: stringAttribute(node, 'text-anchor') as rnsvg.TextAnchor,
    textDecoration: stringAttribute(node, 'text-decoration') as rnsvg.TextDecoration,
    letterSpacing: numericAttribute(node, 'letter-spacing'),
    wordSpacing: numericAttribute(node, 'word-spacing'),
    kerning: numericAttribute(node, 'kerning'),
    fontVariantLigatures: stringAttribute(
      node,
      'fontVariantLigatures'
    ) as rnsvg.FontVariantLigatures,
  })

const fontProps = (node: Element): rnsvg.FontProps =>
  filter({
    ...fontObject(node),
  })

const transformObject = (node: Element): rnsvg.TransformObject =>
  filter({
    scale: numericAttribute(node, 'scale'),
    rotate: numericAttribute(node, 'rotate'),
    rotation: numericAttribute(node, 'rotation'),
    translate: numericAttribute(node, 'translate'),
    // translateX: numericAttribute(node, 'translateX'),
    // translateY: numericAttribute(node, 'translateY'),
    x: numericAttribute(node, 'x'),
    y: numericAttribute(node, 'y'),
    origin: numericAttribute(node, 'origin'),
    // originX: numericAttribute(node, 'originX'),
    // originY: numericAttribute(node, 'originY'),
    skew: numericAttribute(node, 'skew'),
    // skewX: numericAttribute(node, 'skewX'),
    // skewY: numericAttribute(node, 'skewY'),
  })

const transformProps = (node: Element): rnsvg.TransformProps =>
  filter({
    ...transformObject(node),
    // transform?: ColumnMajorTransformMatrix | string | TransformObject,
  })

const commonMaskProps = (node: Element): rnsvg.CommonMaskProps =>
  filter({
    mask: stringAttribute(node, 'mask'),
  })

const commonPathProps = (node: Element): rnsvg.CommonPathProps =>
  filter({
    ...fillProps(node),
    ...strokeProps(node),
    ...clipProps(node),
    ...transformProps(node),
    ...definitionProps(node),
    ...commonMaskProps(node),
  })

const applyClass = (styles: Styles, node: Element): object => {
  const class1 = node.getAttribute('class')
  if (class1) {
    if (styles[class1]) {
      return styles[class1]
    } else {
      log('no style for class %s (%o)', class1, styles)
    }
  }
  return {}
}

// Element props
const circleProps = (styles: Styles, node: Element): rnsvg.CircleProps =>
  filter({
    ...applyClass(styles, node),
    ...commonPathProps(node),
    ...filter({
      cx: numericAttribute(node, 'cx'),
      cy: numericAttribute(node, 'cy'),
      opacity: numericAttribute(node, 'opacity'),
      r: numericAttribute(node, 'r'),
    }),
  })

const clipPathProps = (styles: Styles, node: Element): rnsvg.ClipPathProps =>
  filter({
    ...applyClass(styles, node),
    id: requiredStringAttribute(node, 'id'),
  })

const ellipseProps = (styles: Styles, node: Element): rnsvg.EllipseProps =>
  filter({
    ...applyClass(styles, node),
    ...commonPathProps(node),
    ...filter({
      cx: numericAttribute(node, 'cx'),
      cy: numericAttribute(node, 'cy'),
      opacity: numericAttribute(node, 'opacity'),
      rx: numericAttribute(node, 'rx'),
      ry: numericAttribute(node, 'ry'),
    }),
  })

const gProps = (styles: Styles, node: Element): rnsvg.GProps =>
  filter({
    ...applyClass(styles, node),
    ...commonPathProps(node),
    ...filter({
      opacity: numericAttribute(node, 'opacity'),
    }),
  })

const imageProps = (styles: Styles, node: Element): rnsvg.ImageProps =>
  filter({
    x: numericAttribute(node, 'x'),
    y: numericAttribute(node, 'y'),
    width: numericAttribute(node, 'width'),
    height: numericAttribute(node, 'height'),
    href: requiredHrefAttribute(node),
    preserveAspectRatio: stringAttribute(node, 'preserveAspectRatio'),
    opacity: numericAttribute(node, 'opacity'),
  })

const lineProps = (styles: Styles, node: Element): rnsvg.LineProps =>
  filter({
    ...applyClass(styles, node),
    ...commonPathProps(node),
    ...filter({
      opacity: numericAttribute(node, 'opacity'),
      x1: numericAttribute(node, 'x1'),
      x2: numericAttribute(node, 'x2'),
      y1: numericAttribute(node, 'y1'),
      y2: numericAttribute(node, 'y2'),
    }),
  })

const linearGradientProps = (styles: Styles, node: Element): rnsvg.LinearGradientProps =>
  filter({
    ...applyClass(styles, node),
    ...filter({
      x1: numericAttribute(node, 'x1'),
      x2: numericAttribute(node, 'x2'),
      y1: numericAttribute(node, 'y1'),
      y2: numericAttribute(node, 'y2'),
      gradientUnits: numericAttribute(node, 'gradientUnits') as rnsvg.Units,
      id: requiredStringAttribute(node, 'id'),
    }),
  })

const pathProps = (styles: Styles, node: Element): rnsvg.PathProps =>
  filter({
    ...applyClass(styles, node),
    ...commonPathProps(node),
    ...filter({
      d: requiredStringAttribute(node, 'd'),
      opacity: numericAttribute(node, 'opacity'),
    }),
  })

const patternProps = (styles: Styles, node: Element): rnsvg.PatternProps =>
  filter({
    ...applyClass(styles, node),
    ...filter({
      id: requiredStringAttribute(node, 'id'),
      x: numericAttribute(node, 'x'),
      y: numericAttribute(node, 'y'),
      width: numericAttribute(node, 'width'),
      height: numericAttribute(node, 'height'),
      patternTransform: stringAttribute(node, 'patternTransform'),
      patternUnits: numericAttribute(node, 'patternUnits') as rnsvg.Units,
      patternContentUnits: numericAttribute(node, 'patternContentUnits') as rnsvg.Units,
      viewBox: stringAttribute(node, 'viewBox'),
      preserveAspectRatio: stringAttribute(node, 'preserveAspectRatio'),
    }),
  })

const polygonProps = (styles: Styles, node: Element): rnsvg.PolygonProps =>
  filter({
    ...applyClass(styles, node),
    ...commonPathProps(node),
    ...filter({
      opacity: numericAttribute(node, 'opacity'),
      points: requiredStringAttribute(node, 'points'),
    }),
  })

const polylineProps = (styles: Styles, node: Element): rnsvg.PolylineProps =>
  filter({
    ...applyClass(styles, node),
    ...commonPathProps(node),
    ...filter({
      opacity: numericAttribute(node, 'opacity'),
      points: requiredStringAttribute(node, 'points'),
    }),
  })

const radialGradientProps = (styles: Styles, node: Element): rnsvg.RadialGradientProps =>
  filter({
    ...applyClass(styles, node),
    ...filter({
      fx: numericAttribute(node, 'fx'),
      fy: numericAttribute(node, 'fy'),
      rx: numericAttribute(node, 'rx'),
      ry: numericAttribute(node, 'ry'),
      cx: numericAttribute(node, 'cx'),
      cy: numericAttribute(node, 'cy'),
      r: numericAttribute(node, 'r'),
      gradientUnits: numericAttribute(node, 'gradientUnits') as rnsvg.Units,
      id: requiredStringAttribute(node, 'id'),
    }),
  })

const rectProps = (styles: Styles, node: Element): rnsvg.RectProps =>
  filter({
    ...applyClass(styles, node),
    ...commonPathProps(node),
    ...filter({
      x: numericAttribute(node, 'x'),
      y: numericAttribute(node, 'y'),
      width: numericAttribute(node, 'width'),
      height: numericAttribute(node, 'height'),
      rx: numericAttribute(node, 'rx'),
      ry: numericAttribute(node, 'ry'),
      opacity: numericAttribute(node, 'opacity'),
    }),
  })

const stopProps = (styles: Styles, node: Element): rnsvg.StopProps =>
  filter({
    ...applyClass(styles, node),
    ...filter({
      stopColor: stringAttribute(node, 'stop-color'),
      stopOpacity: numericAttribute(node, 'stop-opacity'),
      offset: numericAttribute(node, 'offset'),
    }),
  })

const svgProps = (styles: Styles, node: Element): rnsvg.SvgProps =>
  filter({
    ...filter({
      width: numericAttribute(node, 'width'),
      height: numericAttribute(node, 'height'),
      viewBox: stringAttribute(node, 'viewBox'),
      preserveAspectRatio: stringAttribute(node, 'preserveAspectRatio'),
    }),
  })

const symbolProps = (styles: Styles, node: Element): rnsvg.SymbolProps =>
  filter({
    ...applyClass(styles, node),
    ...filter({
      id: requiredStringAttribute(node, 'id'),
      viewBox: stringAttribute(node, 'viewBox'),
      preserveAspectRatio: stringAttribute(node, 'preserveAspectRatio'),
      opacity: numericAttribute(node, 'opacity'),
    }),
  })

const tSpanProps = (styles: Styles, node: Element): rnsvg.TSpanProps =>
  filter({
    ...applyClass(styles, node),
    ...commonPathProps(node),
    ...fontProps(node),
    ...filter({
      dx: numericAttribute(node, 'dx'),
      dy: numericAttribute(node, 'dy'),
    }),
  })

const textSpecificProps = (node: Element): rnsvg.TextSpecificProps =>
  filter({
    ...commonPathProps(node),
    ...fontProps(node),
    ...filter({
      alignmentBaseline: stringAttribute(node, 'alignment-baseline') as rnsvg.AlignmentBaseline,
      baselineShift: stringAttribute(node, 'baseline-shift') as rnsvg.BaselineShift,
      // verticalAlign: numericAttribute(node, 'vertical-align'),
      lengthAdjust: stringAttribute(node, 'lengthAdjust') as rnsvg.LengthAdjust,
      textLength: numericAttribute(node, 'textLength'),
      // fontData?: null | { [name: string]: any },
      fontFeatureSettings: stringAttribute(node, 'fontFeatureSettings'),
    }),
  })

const textProps = (styles: Styles, node: Element): rnsvg.TextProps =>
  filter({
    ...applyClass(styles, node),
    ...textSpecificProps(node),
    ...filter({
      dx: numericAttribute(node, 'dx'),
      dy: numericAttribute(node, 'dy'),
      opacity: numericAttribute(node, 'opacity'),
    }),
  })

const textPathProps = (styles: Styles, node: Element): rnsvg.TextPathProps =>
  filter({
    ...applyClass(styles, node),
    ...textSpecificProps(node),
    ...filter({
      xlinkHref: stringAttribute(node, 'xlink:href'),
      href: requiredStringAttribute(node, 'href'),
      startOffset: numericAttribute(node, 'startOffset'),
      method: stringAttribute(node, 'method') as rnsvg.TextPathMethod,
      spacing: stringAttribute(node, 'spacing') as rnsvg.TextPathSpacing,
      midLine: stringAttribute(node, 'midLine') as rnsvg.TextPathMidLine,
    }),
  })

const useProps = (styles: Styles, node: Element): rnsvg.UseProps =>
  filter({
    ...applyClass(styles, node),
    ...commonPathProps(node),
    ...filter({
      xlinkHref: stringAttribute(node, 'xlink:href'),
      href: requiredStringAttribute(node, 'href'),
      width: numericAttribute(node, 'width'),
      height: numericAttribute(node, 'height'),
      x: numericAttribute(node, 'x'),
      y: numericAttribute(node, 'y'),
      opacity: numericAttribute(node, 'opacity'),
    }),
  })

interface SvgProps {
  width?: number | string
  height?: number | string
  fill?: string
}

const renderNode = (
  overrideSvgProps: SvgProps,
  path: string,
  styles: Styles,
  node: Element
): React.ReactNode => {
  if (!node.nodeName) {
    return null
  }

  const key = path + '.' + node.nodeName
  const children = node.childNodes
    ? Array.from(node.childNodes).map((child, i) =>
        renderNode(overrideSvgProps, key + '[' + i + ']', styles, child as Element)
      )
    : null

  switch (node.nodeName) {
    case 'xml':
    case '#document':
      return children

    case '#comment':
    case '#text':
      return null

    case 'svg':
      if (node.attributes) {
        return (
          <Svg key={key} {...svgProps(styles, node)} {...overrideSvgProps}>
            {children}
          </Svg>
        )
      } else {
        return null
      }

    case 'style':
      Object.assign(styles, styles, parseStyles(node))
      return null

    case 'g':
      return (
        <G key={key} {...gProps(styles, node)}>
          {children}
        </G>
      )

    case 'path':
      return (
        <Path key={key} {...pathProps(styles, node)}>
          {children}
        </Path>
      )

    case 'clipPath':
      return (
        <ClipPath key={key} {...clipPathProps(styles, node)}>
          {children}
        </ClipPath>
      )

    case 'circle':
      return (
        <Circle key={key} {...circleProps(styles, node)}>
          {children}
        </Circle>
      )

    case 'rect':
      return (
        <Rect key={key} {...rectProps(styles, node)}>
          {children}
        </Rect>
      )

    case 'line':
      return (
        <Line key={key} {...lineProps(styles, node)}>
          {children}
        </Line>
      )

    case 'defs':
      return <Defs key={key}>{children}</Defs>

    case 'use':
      return <Use key={key} {...useProps(styles, node)} />

    case 'linearGradient':
      return (
        <LinearGradient key={key} {...linearGradientProps(styles, node)}>
          {children}
        </LinearGradient>
      )

    case 'radialGradient':
      return (
        <RadialGradient key={key} {...radialGradientProps(styles, node)}>
          {children}
        </RadialGradient>
      )

    case 'stop':
      return (
        <Stop key={key} {...stopProps(styles, node)}>
          {children}
        </Stop>
      )

    case 'ellipse':
      return (
        <Ellipse key={key} {...ellipseProps(styles, node)}>
          {children}
        </Ellipse>
      )

    case 'polygon':
      return (
        <Polygon key={key} {...polygonProps(styles, node)}>
          {children}
        </Polygon>
      )

    case 'polyline':
      return (
        <Polyline key={key} {...polylineProps(styles, node)}>
          {children}
        </Polyline>
      )

    case 'text':
      return (
        <Text key={key} {...textProps(styles, node)}>
          {children}
        </Text>
      )

    case 'tspan':
      return (
        <TSpan key={key} {...tSpanProps(styles, node)}>
          {children}
        </TSpan>
      )

    default:
      log('unhandled type %s %o', node.nodeName, node)
      return null
  }
}
