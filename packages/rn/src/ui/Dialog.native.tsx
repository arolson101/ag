import { AppContext, ButtonConfig, DialogFooterProps, DialogProps, UiContext } from '@ag/app'
import { Container, Content, platform } from '@ag/ui-nativebase'
import debug from 'debug'
import React from 'react'
import { Platform } from 'react-native'
import {
  Navigation,
  NavigationButtonPressedEvent,
  OptionsTopBarButton,
} from 'react-native-navigation'
import shallowequal from 'shallowequal'

const log = debug('rn:dialog')

export interface DialogContext extends AppContext {
  componentId: string
}
export const DialogContext = React.createContext<DialogContext>({ componentId: 'NONE' } as any)
DialogContext.displayName = `DialogContext`

export class Dialog extends React.PureComponent<DialogProps> {
  static contextType = DialogContext
  context!: React.ContextType<typeof DialogContext>

  componentDidMount() {
    const { title } = this.props
    const { componentId } = this.context
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: title,
        },
        largeTitle: {
          visible: false,
        },
      },
    })
  }

  render() {
    return <>{this.props.children}</>
  }
}

export const DialogBody: UiContext['DialogBody'] = ({ children }) => (
  <Container>
    <Content>{children}</Content>
  </Container>
)
DialogBody.displayName = 'DialogBody'

type TopButtonId = 'primary' | 'secondary'

export class DialogFooter extends React.Component<DialogFooterProps> {
  static contextType = DialogContext
  context!: React.ContextType<typeof DialogContext>

  shouldComponentUpdate(nextProps: DialogFooterProps) {
    return !(
      shallowequal(this.props.primary, nextProps.primary) &&
      shallowequal(this.props.secondary, nextProps.secondary)
    )
  }

  componentDidMount() {
    // log('componentDidMount')
    this.setButtons()
  }

  componentDidUpdate(prevProps: DialogFooterProps) {
    // log('componentDidUpdate %o %o', this.props, prevProps)
    this.setButtons()
  }

  setButtons() {
    const { primary, secondary } = this.props
    const { componentId } = this.context

    // log('setting buttons')
    Navigation.mergeOptions(componentId, {
      topBar:
        Platform.OS === 'ios'
          ? {
              rightButtons: [makeButton('primary', primary)],
              leftButtons: secondary && [makeButton('secondary', secondary)],
            }
          : {
              rightButtons: [
                makeButton('primary', primary),
                ...(secondary ? [makeButton('secondary', secondary)] : []),
              ],
            },
    })

    Navigation.events().bindComponent(this, componentId)
  }

  navigationButtonPressed(e: NavigationButtonPressedEvent) {
    // log('navigationButtonPressed: %o', e)
    this.props[e.buttonId as TopButtonId]!.onClick(e as any)
  }

  render() {
    return null
  }
}

const makeButton = (id: TopButtonId, opts: ButtonConfig): OptionsTopBarButton => ({
  id,
  text: opts.title,
  color: opts.isDanger ? 'red' : platform.toolbarBtnTextColor,
  enabled: !opts.disabled,
})
