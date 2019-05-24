import { DataUri, decodeDataUri, isDataUri } from '@ag/util'
import Axios, { CancelTokenSource } from 'axios'
import css, { Declaration, Rule } from 'css'
import debug from 'debug'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { ImageProperties, ImageURISource, StyleProp, View, ViewStyle } from 'react-native'
import * as RnSvg from 'react-native-svg'
import xmldom from 'xmldom'

const log = debug('react-native-svg-image')

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

  private cancelSource?: CancelTokenSource
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
    if (this.cancelSource) {
      this.cancelSource.cancel()
    }
    this.cancelSource = Axios.CancelToken.source()

    if (!uri) {
      this.setState({ text: undefined, doc: undefined })
    } else {
      let text: string
      if (isDataUri(uri)) {
        const { buf } = decodeDataUri(uri as DataUri)
        text = buf.toString()
      } else {
        const data = await Axios.get<string>(uri, { cancelToken: this.cancelSource.token })
        text = data.data
      }

      const doc = text ? new xmldom.DOMParser().parseFromString(text) : undefined
      if (doc) {
        this.setState({ doc, text })
      } else {
        log('no document from string %s', text)
      }
    }
  }

  componentWillUnmount() {
    if (this.cancelSource) {
      this.cancelSource.cancel()
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

  // log('parseStyles %o', styles)
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

const fillProps = (node: Element): RnSvg.FillProps =>
  filter({
    fill: stringAttribute(node, 'fill'),
    fillOpacity: numericAttribute(node, 'fill-opacity'),
    fillRule: stringAttribute(node, 'fill-rule') as RnSvg.FillRule,
  })

const clipProps = (node: Element): RnSvg.ClipProps =>
  filter({
    clipRule: stringAttribute(node, 'clip-rule') as RnSvg.FillRule,
    clipPath: stringAttribute(node, 'clip-path'),
  })

const definitionProps = (node: Element): RnSvg.DefinitionProps =>
  filter({
    id: stringAttribute(node, 'id'),
  })

const strokeProps = (node: Element): RnSvg.StrokeProps =>
  filter({
    stroke: stringAttribute(node, 'stroke'),
    strokeWidth: numericAttribute(node, 'stroke-width'),
    strokeOpacity: numericAttribute(node, 'stroke-opacity'),
    strokeDasharray: numericOrArrayAttribute(node, 'stroke-dasharray'),
    strokeDashoffset: numericAttribute(node, 'stroke-dashoffset'),
    strokeLinecap: stringAttribute(node, 'stroke-linecap') as RnSvg.Linecap,
    strokeLinejoin: stringAttribute(node, 'stroke-linejoin') as RnSvg.Linejoin,
    strokeMiterlimit: numericAttribute(node, 'stroke-miterlimit'),
  })

const fontObject = (node: Element): RnSvg.FontObject =>
  filter({
    fontStyle: stringAttribute(node, 'font-style') as RnSvg.FontStyle,
    fontVariant: stringAttribute(node, 'font-variant') as RnSvg.FontVariant,
    fontWeight: stringAttribute(node, 'font-weight') as RnSvg.FontWeight,
    fontStretch: stringAttribute(node, 'font-stretch') as RnSvg.FontStretch,
    fontSize: numericAttribute(node, 'font-size'),
    fontFamily: stringAttribute(node, 'font-family'),
    textAnchor: stringAttribute(node, 'text-anchor') as RnSvg.TextAnchor,
    textDecoration: stringAttribute(node, 'text-decoration') as RnSvg.TextDecoration,
    letterSpacing: numericAttribute(node, 'letter-spacing'),
    wordSpacing: numericAttribute(node, 'word-spacing'),
    kerning: numericAttribute(node, 'kerning'),
    fontVariantLigatures: stringAttribute(
      node,
      'fontVariantLigatures'
    ) as RnSvg.FontVariantLigatures,
  })

const fontProps = (node: Element): RnSvg.FontProps =>
  filter({
    ...fontObject(node),
  })

const transformObject = (node: Element): RnSvg.TransformObject =>
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

const transformProps = (node: Element): RnSvg.TransformProps =>
  filter({
    ...transformObject(node),
    // transform?: ColumnMajorTransformMatrix | string | TransformObject,
  })

const commonMaskProps = (node: Element): RnSvg.CommonMaskProps =>
  filter({
    mask: stringAttribute(node, 'mask'),
  })

const commonPathProps = (node: Element): RnSvg.CommonPathProps =>
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
const circleProps = (styles: Styles, node: Element): RnSvg.CircleProps =>
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

const clipPathProps = (styles: Styles, node: Element): RnSvg.ClipPathProps =>
  filter({
    ...applyClass(styles, node),
    id: requiredStringAttribute(node, 'id'),
  })

const ellipseProps = (styles: Styles, node: Element): RnSvg.EllipseProps =>
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

const gProps = (styles: Styles, node: Element): RnSvg.GProps =>
  filter({
    ...applyClass(styles, node),
    ...commonPathProps(node),
    ...filter({
      opacity: numericAttribute(node, 'opacity'),
    }),
  })

const imageProps = (styles: Styles, node: Element): RnSvg.ImageProps =>
  filter({
    x: numericAttribute(node, 'x'),
    y: numericAttribute(node, 'y'),
    width: numericAttribute(node, 'width'),
    height: numericAttribute(node, 'height'),
    href: requiredHrefAttribute(node),
    preserveAspectRatio: stringAttribute(node, 'preserveAspectRatio'),
    opacity: numericAttribute(node, 'opacity'),
  })

const lineProps = (styles: Styles, node: Element): RnSvg.LineProps =>
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

const linearGradientProps = (styles: Styles, node: Element): RnSvg.LinearGradientProps =>
  filter({
    ...applyClass(styles, node),
    ...filter({
      x1: numericAttribute(node, 'x1'),
      x2: numericAttribute(node, 'x2'),
      y1: numericAttribute(node, 'y1'),
      y2: numericAttribute(node, 'y2'),
      gradientUnits: numericAttribute(node, 'gradientUnits') as RnSvg.Units,
      id: requiredStringAttribute(node, 'id'),
    }),
  })

const pathProps = (styles: Styles, node: Element): RnSvg.PathProps =>
  filter({
    ...applyClass(styles, node),
    ...commonPathProps(node),
    ...filter({
      d: requiredStringAttribute(node, 'd'),
      opacity: numericAttribute(node, 'opacity'),
    }),
  })

const patternProps = (styles: Styles, node: Element): RnSvg.PatternProps =>
  filter({
    ...applyClass(styles, node),
    ...filter({
      id: requiredStringAttribute(node, 'id'),
      x: numericAttribute(node, 'x'),
      y: numericAttribute(node, 'y'),
      width: numericAttribute(node, 'width'),
      height: numericAttribute(node, 'height'),
      patternTransform: stringAttribute(node, 'patternTransform'),
      patternUnits: numericAttribute(node, 'patternUnits') as RnSvg.Units,
      patternContentUnits: numericAttribute(node, 'patternContentUnits') as RnSvg.Units,
      viewBox: stringAttribute(node, 'viewBox'),
      preserveAspectRatio: stringAttribute(node, 'preserveAspectRatio'),
    }),
  })

const polygonProps = (styles: Styles, node: Element): RnSvg.PolygonProps =>
  filter({
    ...applyClass(styles, node),
    ...commonPathProps(node),
    ...filter({
      opacity: numericAttribute(node, 'opacity'),
      points: requiredStringAttribute(node, 'points'),
    }),
  })

const polylineProps = (styles: Styles, node: Element): RnSvg.PolylineProps =>
  filter({
    ...applyClass(styles, node),
    ...commonPathProps(node),
    ...filter({
      opacity: numericAttribute(node, 'opacity'),
      points: requiredStringAttribute(node, 'points'),
    }),
  })

const radialGradientProps = (styles: Styles, node: Element): RnSvg.RadialGradientProps =>
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
      gradientUnits: numericAttribute(node, 'gradientUnits') as RnSvg.Units,
      id: requiredStringAttribute(node, 'id'),
    }),
  })

const rectProps = (styles: Styles, node: Element): RnSvg.RectProps =>
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

const stopProps = (styles: Styles, node: Element): RnSvg.StopProps =>
  filter({
    ...applyClass(styles, node),
    ...filter({
      stopColor: stringAttribute(node, 'stop-color'),
      stopOpacity: numericAttribute(node, 'stop-opacity'),
      offset: numericAttribute(node, 'offset'),
    }),
  })

const svgProps = (styles: Styles, node: Element): RnSvg.SvgProps =>
  filter({
    ...filter({
      width: numericAttribute(node, 'width'),
      height: numericAttribute(node, 'height'),
      viewBox: stringAttribute(node, 'viewBox'),
      preserveAspectRatio: stringAttribute(node, 'preserveAspectRatio'),
    }),
  })

const symbolProps = (styles: Styles, node: Element): RnSvg.SymbolProps =>
  filter({
    ...applyClass(styles, node),
    ...filter({
      id: requiredStringAttribute(node, 'id'),
      viewBox: stringAttribute(node, 'viewBox'),
      preserveAspectRatio: stringAttribute(node, 'preserveAspectRatio'),
      opacity: numericAttribute(node, 'opacity'),
    }),
  })

const tSpanProps = (styles: Styles, node: Element): RnSvg.TSpanProps =>
  filter({
    ...applyClass(styles, node),
    ...commonPathProps(node),
    ...fontProps(node),
    ...filter({
      dx: numericAttribute(node, 'dx'),
      dy: numericAttribute(node, 'dy'),
    }),
  })

const textSpecificProps = (node: Element): RnSvg.TextSpecificProps =>
  filter({
    ...commonPathProps(node),
    ...fontProps(node),
    ...filter({
      alignmentBaseline: stringAttribute(node, 'alignment-baseline') as RnSvg.AlignmentBaseline,
      baselineShift: stringAttribute(node, 'baseline-shift') as RnSvg.BaselineShift,
      // verticalAlign: numericAttribute(node, 'vertical-align'),
      lengthAdjust: stringAttribute(node, 'lengthAdjust') as RnSvg.LengthAdjust,
      textLength: numericAttribute(node, 'textLength'),
      // fontData?: null | { [name: string]: any },
      fontFeatureSettings: stringAttribute(node, 'fontFeatureSettings'),
    }),
  })

const textProps = (styles: Styles, node: Element): RnSvg.TextProps =>
  filter({
    ...applyClass(styles, node),
    ...textSpecificProps(node),
    ...filter({
      dx: numericAttribute(node, 'dx'),
      dy: numericAttribute(node, 'dy'),
      opacity: numericAttribute(node, 'opacity'),
    }),
  })

const textPathProps = (styles: Styles, node: Element): RnSvg.TextPathProps =>
  filter({
    ...applyClass(styles, node),
    ...textSpecificProps(node),
    ...filter({
      xlinkHref: stringAttribute(node, 'xlink:href'),
      href: requiredStringAttribute(node, 'href'),
      startOffset: numericAttribute(node, 'startOffset'),
      method: stringAttribute(node, 'method') as RnSvg.TextPathMethod,
      spacing: stringAttribute(node, 'spacing') as RnSvg.TextPathSpacing,
      midLine: stringAttribute(node, 'midLine') as RnSvg.TextPathMidLine,
    }),
  })

const useProps = (styles: Styles, node: Element): RnSvg.UseProps =>
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
          <RnSvg.Svg key={key} {...svgProps(styles, node)} {...overrideSvgProps}>
            {children}
          </RnSvg.Svg>
        )
      } else {
        return null
      }

    case 'style':
      Object.assign(styles, styles, parseStyles(node))
      return null

    case 'g':
      return (
        <RnSvg.G key={key} {...gProps(styles, node)}>
          {children}
        </RnSvg.G>
      )

    case 'path':
      return (
        <RnSvg.Path key={key} {...pathProps(styles, node)}>
          {children}
        </RnSvg.Path>
      )

    case 'clipPath':
      return (
        <RnSvg.ClipPath key={key} {...clipPathProps(styles, node)}>
          {children}
        </RnSvg.ClipPath>
      )

    case 'circle':
      return (
        <RnSvg.Circle key={key} {...circleProps(styles, node)}>
          {children}
        </RnSvg.Circle>
      )

    case 'rect':
      return (
        <RnSvg.Rect key={key} {...rectProps(styles, node)}>
          {children}
        </RnSvg.Rect>
      )

    case 'line':
      return (
        <RnSvg.Line key={key} {...lineProps(styles, node)}>
          {children}
        </RnSvg.Line>
      )

    case 'defs':
      return <RnSvg.Defs key={key}>{children}</RnSvg.Defs>

    case 'use':
      return <RnSvg.Use key={key} {...useProps(styles, node)} />

    case 'linearGradient':
      return (
        <RnSvg.LinearGradient key={key} {...linearGradientProps(styles, node)}>
          {children}
        </RnSvg.LinearGradient>
      )

    case 'radialGradient':
      return (
        <RnSvg.RadialGradient key={key} {...radialGradientProps(styles, node)}>
          {children}
        </RnSvg.RadialGradient>
      )

    case 'stop':
      return (
        <RnSvg.Stop key={key} {...stopProps(styles, node)}>
          {children}
        </RnSvg.Stop>
      )

    case 'ellipse':
      return (
        <RnSvg.Ellipse key={key} {...ellipseProps(styles, node)}>
          {children}
        </RnSvg.Ellipse>
      )

    case 'polygon':
      return (
        <RnSvg.Polygon key={key} {...polygonProps(styles, node)}>
          {children}
        </RnSvg.Polygon>
      )

    case 'polyline':
      return (
        <RnSvg.Polyline key={key} {...polylineProps(styles, node)}>
          {children}
        </RnSvg.Polyline>
      )

    case 'text':
      return (
        <RnSvg.Text key={key} {...textProps(styles, node)}>
          {children}
        </RnSvg.Text>
      )

    case 'tspan':
      return (
        <RnSvg.TSpan key={key} {...tSpanProps(styles, node)}>
          {children}
        </RnSvg.TSpan>
      )

    default:
      log('unhandled type %s %o', node.nodeName, node)
      return null
  }
}
