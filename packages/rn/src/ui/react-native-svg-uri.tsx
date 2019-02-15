import css, { Declaration, Rule } from 'css'
import debug from 'debug'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { ImageURISource, StyleProp, View, ViewStyle } from 'react-native'
const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource')
import xmldom from 'xmldom'

const log = debug('rn:react-native-svg-uri')

import Svg, {
  Circle,
  CircleProps,
  Defs,
  Ellipse,
  G,
  GProps,
  Line,
  LinearGradient,
  Path,
  PathProps,
  Polygon,
  Polyline,
  RadialGradient,
  Rect,
  Stop,
  SvgProps,
  Text,
  TSpan,
  Use,
} from 'react-native-svg'

namespace utils {
  export const camelCase = (value: string) => value.replace(/-([a-z])/g, g => g[1].toUpperCase())

  export const camelCaseNodeName = ({ nodeName, nodeValue }: any) => ({
    nodeName: camelCase(nodeName),
    nodeValue,
  })

  export const removePixelsFromNodeValue = ({ nodeName, nodeValue }: any) => ({
    nodeName,
    nodeValue: nodeValue.replace('px', ''),
  })

  export const transformStyle = ({ nodeName, nodeValue, fillProp }: any) => {
    if (nodeName === 'style') {
      return nodeValue.split(';').reduce((acc: object, attribute: string) => {
        const [property, value] = attribute.split(':')
        if (property === '') {
          return acc
        } else {
          return {
            ...acc,
            [camelCase(property)]: fillProp && property === 'fill' ? fillProp : value,
          }
        }
      }, {})
    }
    return null
  }

  export const getEnabledAttributes = (enabledAttributes: string[]) => ({ nodeName }: any) =>
    enabledAttributes.includes(camelCase(nodeName))
}

const ACCEPTED_SVG_ELEMENTS = [
  'svg',
  'g',
  'circle',
  'path',
  'rect',
  'defs',
  'line',
  'linearGradient',
  'radialGradient',
  'stop',
  'ellipse',
  'polygon',
  'polyline',
  'text',
  'tspan',
  'use',
]

// Attributes from SVG elements that are mapped directly.
const SVG_ATTS = ['viewBox', 'width', 'height']
const G_ATTS = [] as string[]

const CIRCLE_ATTS = ['cx', 'cy', 'r']
const PATH_ATTS = ['d']
const RECT_ATTS = ['width', 'height', 'rx', 'ry']
const LINE_ATTS = ['x1', 'y1', 'x2', 'y2']
const LINEARG_ATTS = LINE_ATTS.concat(['gradientUnits'])
const RADIALG_ATTS = CIRCLE_ATTS.concat(['gradientUnits'])
const STOP_ATTS = ['offset', 'stopColor']
const ELLIPSE_ATTS = ['cx', 'cy', 'rx', 'ry']

const TEXT_ATTS = ['fontFamily', 'fontSize', 'fontWeight', 'textAnchor']

const POLYGON_ATTS = ['points']
const POLYLINE_ATTS = ['points']

const USE_ATTS = ['href']

const COMMON_ATTS = [
  'id',
  'fill',
  'fillOpacity',
  'stroke',
  'strokeWidth',
  'strokeOpacity',
  'opacity',
  'strokeLinecap',
  'strokeLinejoin',
  'strokeDasharray',
  'strokeDashoffset',
  'x',
  'y',
  'rotate',
  'scale',
  'origin',
  'originX',
  'originY',
  'transform',
  'clipPath',
]

type ArrayElements = Array<string | JSX.Element>

let ind = 0

// https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use#Attributes
const fixXlinkHref = (node: Element) => {
  if (node.attributes) {
    const hrefAttr = Object.keys(node.attributes).find(
      a => node.attributes[a as any].name === 'href'
    )
    const legacyHrefAttr = Object.keys(node.attributes).find(
      a => node.attributes[a as any].name === 'xlink:href'
    )

    return node.attributes[(hrefAttr || legacyHrefAttr) as any].value
  }
  return null
}

const fixYPosition = (y: React.ReactText, node: Element): React.ReactText => {
  if (node.attributes) {
    const fontSizeAttr = Object.keys(node.attributes).find(
      a => node.attributes[a as any].name === 'font-size'
    )
    if (fontSizeAttr) {
      return '' + (parseFloat(y as string) - parseFloat(node.attributes[fontSizeAttr as any].value))
    }
  }
  if (!node.parentNode) {
    return y
  }
  return fixYPosition(y, node.parentNode as any)
}

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
   * e.g. source={{ur: 'my-path'}}
   */
  source?: ImageURISource

  /**
   * Direct svg code to render. Similar to inline svg
   */
  svgXmlData?: string

  /**
   * Fill color for the svg object
   */
  fill?: string

  onLoad?: () => any
  style?: StyleProp<ViewStyle>
  fillAll?: boolean
}

interface State {
  fill?: string
  svgXmlData?: string
  source?: ImageURISource
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

  private isComponentMounted: boolean
  state: State

  constructor(props: SvgUriProps) {
    super(props)

    this.state = { fill: props.fill, svgXmlData: props.svgXmlData }
    this.isComponentMounted = false
  }

  async componentDidMount() {
    this.isComponentMounted = true

    // Gets the image data from an URL or a static file
    if (this.props.source) {
      const source = resolveAssetSource(this.props.source) || {}
      const svgXmlData = await this.fetchSVGData(source.uri)
      // log('svgXmlData %o', svgXmlData)

      // if (this.isComponentMounted) {
      this.setState({ svgXmlData }, () => {
        const { onLoad } = this.props
        if (onLoad) {
          onLoad()
        }
      })
      // }
    }
  }

  // static getDerivedStateFromProps(nextProps: SvgUriProps, state: State) {
  //   const newState = {}

  //   if (nextProps.svgXmlData !== state.svgXmlData) {
  //     Object.assign(newState, { svgXmlData: nextProps.svgXmlData })
  //   }

  //   if (nextProps.fill !== state.fill) {
  //     Object.assign(newState, { fill: nextProps.fill })
  //   }

  //   return Object.keys(newState).length > 0 ? newState : null
  // }

  async componentDidUpdate(prevProps: SvgUriProps, prevState: State) {
    const { source } = this.props
    if (source) {
      const newSource = resolveAssetSource(source) || {}
      const oldSource = resolveAssetSource(prevProps.source) || {}
      if (newSource.uri !== oldSource.uri) {
        log('componentDidUpdate %O', {
          newSourceURI: newSource.uri,
          oldSourceURI: oldSource.uri,
          prevProps,
          prevState,
          props: this.props,
          state: this.state,
        })
        const svgXmlData = await this.fetchSVGData(newSource.uri)
        this.setState({ svgXmlData })
      }
    }
  }

  componentWillUnmount() {
    this.isComponentMounted = false
  }

  fetchSVGData = async (uri: string) => {
    // log('fetchSVGData %s', uri)
    try {
      const dataSig = 'data:image/svg+xml;'
      if (uri.startsWith(dataSig)) {
        const encoding = uri.substring(dataSig.length, uri.indexOf(',', dataSig.length))
        const data = uri.substring(dataSig.length + encoding.length + 1)
        // log('data uri: encoding %s %o', encoding, { uri, data })
        return Buffer.from(data, encoding).toString('utf8')
      } else {
        const response = await fetch(uri)
        return await response.text()
      }
    } catch (e) {
      console.error('ERROR SVG', e)
    }
  }

  // Remove empty strings from children array
  trimElementChilden(children: ArrayElements) {
    for (const child of children) {
      if (typeof child === 'string') {
        if (child.trim().length === 0) {
          children.splice(children.indexOf(child), 1)
        }
      }
    }
  }

  createSVGElement = (node: Element, childs: ArrayElements): JSX.Element | null => {
    this.trimElementChilden(childs)
    let componentAtts = {} as Record<string, React.ReactText>
    const i = ind++
    switch (node.nodeName) {
      case 'svg':
        componentAtts = this.obtainComponentAtts(node, SVG_ATTS)
        if (this.props.width) {
          componentAtts.width = this.props.width
        }
        if (this.props.height) {
          componentAtts.height = this.props.height
        }

        return (
          <Svg key={i} {...componentAtts}>
            {childs}
          </Svg>
        )
      case 'g':
        componentAtts = this.obtainComponentAtts(node, G_ATTS)
        return (
          <G key={i} {...componentAtts}>
            {childs}
          </G>
        )
      case 'path':
        componentAtts = this.obtainComponentAtts(node, PATH_ATTS)
        if (!componentAtts.d) {
          throw new Error('path does not have d!')
        }
        return (
          <Path key={i} d='' {...componentAtts}>
            {childs}
          </Path>
        )
      case 'circle':
        componentAtts = this.obtainComponentAtts(node, CIRCLE_ATTS)
        return (
          <Circle key={i} {...componentAtts}>
            {childs}
          </Circle>
        )
      case 'rect':
        componentAtts = this.obtainComponentAtts(node, RECT_ATTS)
        return (
          <Rect key={i} {...componentAtts}>
            {childs}
          </Rect>
        )
      case 'line':
        componentAtts = this.obtainComponentAtts(node, LINE_ATTS)
        return (
          <Line key={i} {...componentAtts}>
            {childs}
          </Line>
        )
      case 'defs':
        return <Defs key={i}>{childs}</Defs>
      case 'use':
        componentAtts = this.obtainComponentAtts(node, USE_ATTS)
        componentAtts.href = fixXlinkHref(node)!
        return <Use key={i} href='' {...componentAtts} />
      case 'linearGradient':
        componentAtts = this.obtainComponentAtts(node, LINEARG_ATTS)
        return (
          <LinearGradient id={node.id + '_lg_' + i} key={i} {...componentAtts}>
            {childs}
          </LinearGradient>
        )
      case 'radialGradient':
        componentAtts = this.obtainComponentAtts(node, RADIALG_ATTS)
        return (
          <RadialGradient id={node.id + '_rg_' + i} key={i} {...componentAtts}>
            {childs}
          </RadialGradient>
        )
      case 'stop':
        componentAtts = this.obtainComponentAtts(node, STOP_ATTS)
        return (
          <Stop key={i} {...componentAtts}>
            {childs}
          </Stop>
        )
      case 'ellipse':
        componentAtts = this.obtainComponentAtts(node, ELLIPSE_ATTS)
        return (
          <Ellipse key={i} {...componentAtts}>
            {childs}
          </Ellipse>
        )
      case 'polygon':
        componentAtts = this.obtainComponentAtts(node, POLYGON_ATTS)
        if (!componentAtts.points) {
          throw new Error('polygon does not have points!')
        }
        return (
          <Polygon key={i} points={[]} {...componentAtts}>
            {childs}
          </Polygon>
        )
      case 'polyline':
        componentAtts = this.obtainComponentAtts(node, POLYLINE_ATTS)
        if (!componentAtts.points) {
          throw new Error('polyline does not have points!')
        }
        return (
          <Polyline key={i} points={[]} {...componentAtts}>
            {childs}
          </Polyline>
        )
      case 'text':
        componentAtts = this.obtainComponentAtts(node, TEXT_ATTS)
        return (
          <Text key={i} {...componentAtts}>
            {childs}
          </Text>
        )
      case 'tspan':
        componentAtts = this.obtainComponentAtts(node, TEXT_ATTS)
        if (componentAtts.y) {
          componentAtts.y = fixYPosition(componentAtts.y, node)
        }
        return (
          <TSpan key={i} {...componentAtts}>
            {childs}
          </TSpan>
        )
      default:
        log('unhandled type %s %o', node.nodeName, node)
        return null
    }
  }

  obtainComponentAtts = ({ attributes }: Element, enabledAttributes: string[]) => {
    const styleAtts = {} as Record<string, string>

    if (this.state.fill && this.props.fillAll) {
      styleAtts.fill = this.state.fill
    }

    Array.from(attributes).forEach(({ nodeName, nodeValue }) => {
      Object.assign(
        styleAtts,
        utils.transformStyle({
          nodeName,
          nodeValue,
          fillProp: this.state.fill,
        })
      )
    })

    const componentAtts = Array.from(attributes)
      .map(utils.camelCaseNodeName)
      .map(utils.removePixelsFromNodeValue)
      .filter(utils.getEnabledAttributes(enabledAttributes.concat(COMMON_ATTS)))
      .reduce(
        (acc, { nodeName, nodeValue }) => {
          acc[nodeName] =
            this.state.fill && nodeName === 'fill' && nodeValue !== 'none'
              ? this.state.fill
              : nodeValue
          return acc
        },
        {} as Record<string, string>
      )
    Object.assign(componentAtts, styleAtts)

    return componentAtts
  }

  inspectNode = (node: ChildNode): JSX.Element | null => {
    // Only process accepted elements
    if (!ACCEPTED_SVG_ELEMENTS.includes(node.nodeName)) {
      return <View key={ind++} />
    }

    // Process the xml node
    const arrayElements: ArrayElements = []

    // if have children process them.
    // Recursive function.
    if (node.childNodes && node.childNodes.length > 0) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < node.childNodes.length; i++) {
        const isTextValue = node.childNodes[i].nodeValue
        if (isTextValue) {
          arrayElements.push(node.childNodes[i].nodeValue as string)
        } else {
          const nodo = this.inspectNode(node.childNodes[i])
          if (nodo != null) {
            arrayElements.push(nodo)
          }
        }
      }
    }

    return this.createSVGElement(node as any, arrayElements)
  }

  render() {
    try {
      if (this.state.svgXmlData == null) {
        return null
      }

      ind = 0
      const inputSVG = this.state.svgXmlData
        .substring(
          this.state.svgXmlData.indexOf('<svg '),
          this.state.svgXmlData.indexOf('</svg>') + 6
        )
        .replace(/<!-(.*?)->/g, '')

      // const doc = new xmldom.DOMParser().parseFromString(inputSVG)
      const doc = new xmldom.DOMParser().parseFromString(this.state.svgXmlData)

      log('doc %o', doc)
      // const rootSVG = this.inspectNode(doc.childNodes[0])
      const rootSVG = renderNode('root', {}, doc as any)

      return <View style={this.props.style}>{rootSVG}</View>
    } catch (e) {
      console.error('ERROR SVG', e)
      return null
    }
  }
}

type NodeProps = Record<string, React.ReactText>
type Styles = Record<string, NodeProps>

const obtainProps = <T extends {}>(
  styles: Styles,
  { attributes }: Element,
  enabledAttributes: Array<keyof T>
): T => {
  const props = {} as Record<string, string>

  // if (this.state.fill && this.props.fillAll) {
  //   styleAtts.fill = this.state.fill
  // }

  Array.from(attributes).forEach(({ nodeName, nodeValue }) => {
    Object.assign(
      props,
      utils.transformStyle({
        nodeName,
        nodeValue,
      })
    )
  })

  const componentAtts = Array.from(attributes)
    .map(utils.camelCaseNodeName)
    .map(utils.removePixelsFromNodeValue)
    .filter(utils.getEnabledAttributes((enabledAttributes as string[]).concat(COMMON_ATTS)))
    .reduce(
      (acc, { nodeName, nodeValue }) => {
        acc[nodeName] =
          // this.state.fill && nodeName === 'fill' && nodeValue !== 'none'
          //   ? this.state.fill
          // : nodeValue
          nodeValue
        return acc
      },
      {} as Record<string, string>
    )
  // Object.assign(componentAtts, styleAtts)

  if (componentAtts.class) {
    Object.assign(componentAtts, styles[componentAtts.class], componentAtts)
  }

  return componentAtts as any
}

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

const renderNode = (path: string, styles: Styles, node: Element): React.ReactNode => {
  if (!node.nodeName) {
    return null
  }

  const key = `${path}.${node.nodeName || ''}`

  switch (node.nodeName) {
    case 'xml':
    case '#document':
      return (
        <React.Fragment>
          {Array.from(node.childNodes).map(child => renderNode(key, styles, child as Element))}
        </React.Fragment>
      )

    case '#comment':
    case '#text':
      return null

    case 'svg': {
      const props = obtainProps<SvgProps>(styles, node, [])
      return (
        <Svg key={key} {...props}>
          <React.Fragment>
            {Array.from(node.childNodes).map((child, i) =>
              renderNode(`${key}${i}`, styles, child as Element)
            )}
          </React.Fragment>
        </Svg>
      )
    }

    case 'style': {
      styles = { ...styles, ...parseStyles(node) }
      return null
    }

    case 'g': {
      const props = obtainProps<GProps>(styles, node, [])
      return (
        <G key={key} {...props}>
          <React.Fragment>
            {Array.from(node.childNodes).map((child, i) =>
              renderNode(`${key}${i}`, styles, child as Element)
            )}
          </React.Fragment>
        </G>
      )
    }
    case 'path': {
      const props = obtainProps<PathProps>(styles, node, PATH_ATTS as any)
      return (
        <Path key={key} {...props}>
          <React.Fragment>
            {Array.from(node.childNodes).map((child, i) =>
              renderNode(`${key}${i}`, styles, child as Element)
            )}
          </React.Fragment>
        </Path>
      )
    }
    case 'circle': {
      const props = obtainProps<CircleProps>(styles, node, CIRCLE_ATTS as any)
      return (
        <Circle key={key} {...props}>
          {Array.from(node.childNodes).map((child, i) =>
            renderNode(`${key}${i}`, styles, child as Element)
          )}
        </Circle>
      )
    }
    // case 'rect':
    //   componentAtts = this.obtainComponentAtts(node, RECT_ATTS)
    //   return (
    //     <Rect key={i} {...componentAtts}>
    //       {childs}
    //     </Rect>
    //   )
    // case 'line':
    //   componentAtts = this.obtainComponentAtts(node, LINE_ATTS)
    //   return (
    //     <Line key={i} {...componentAtts}>
    //       {childs}
    //     </Line>
    //   )
    // case 'defs':
    //   return <Defs key={i}>{childs}</Defs>
    // case 'use':
    //   componentAtts = this.obtainComponentAtts(node, USE_ATTS)
    //   componentAtts.href = fixXlinkHref(node)!
    //   return <Use key={i} href='' {...componentAtts} />
    // case 'linearGradient':
    //   componentAtts = this.obtainComponentAtts(node, LINEARG_ATTS)
    //   return (
    //     <LinearGradient id={node.id + '_lg_' + i} key={i} {...componentAtts}>
    //       {childs}
    //     </LinearGradient>
    //   )
    // case 'radialGradient':
    //   componentAtts = this.obtainComponentAtts(node, RADIALG_ATTS)
    //   return (
    //     <RadialGradient id={node.id + '_rg_' + i} key={i} {...componentAtts}>
    //       {childs}
    //     </RadialGradient>
    //   )
    // case 'stop':
    //   componentAtts = this.obtainComponentAtts(node, STOP_ATTS)
    //   return (
    //     <Stop key={i} {...componentAtts}>
    //       {childs}
    //     </Stop>
    //   )
    // case 'ellipse':
    //   componentAtts = this.obtainComponentAtts(node, ELLIPSE_ATTS)
    //   return (
    //     <Ellipse key={i} {...componentAtts}>
    //       {childs}
    //     </Ellipse>
    //   )
    // case 'polygon':
    //   componentAtts = this.obtainComponentAtts(node, POLYGON_ATTS)
    //   if (!componentAtts.points) {
    //     throw new Error('polygon does not have points!')
    //   }
    //   return (
    //     <Polygon key={i} points={[]} {...componentAtts}>
    //       {childs}
    //     </Polygon>
    //   )
    // case 'polyline':
    //   componentAtts = this.obtainComponentAtts(node, POLYLINE_ATTS)
    //   if (!componentAtts.points) {
    //     throw new Error('polyline does not have points!')
    //   }
    //   return (
    //     <Polyline key={i} points={[]} {...componentAtts}>
    //       {childs}
    //     </Polyline>
    //   )
    // case 'text':
    //   componentAtts = this.obtainComponentAtts(node, TEXT_ATTS)
    //   return (
    //     <Text key={i} {...componentAtts}>
    //       {childs}
    //     </Text>
    //   )
    // case 'tspan':
    //   componentAtts = this.obtainComponentAtts(node, TEXT_ATTS)
    //   if (componentAtts.y) {
    //     componentAtts.y = fixYPosition(componentAtts.y, node)
    //   }
    //   return (
    //     <TSpan key={i} {...componentAtts}>
    //       {childs}
    //     </TSpan>
    //   )
    default:
      log('unhandled type %s %o', node.nodeName, node)
      return null
  }
}
