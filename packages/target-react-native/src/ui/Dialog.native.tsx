import { AppContext, ButtonConfig, DialogProps, UiContext } from '@ag/core'
import { Container, Content, platform } from '@ag/ui-nativebase'
import debug from 'debug'
import React from 'react'
import { Platform } from 'react-native'
import {
  Navigation,
  NavigationButtonPressedEvent,
  OptionsTopBarButton,
} from 'react-native-navigation'

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
    this.setButtons()
  }

  componentDidUpdate() {
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
    return <>{this.props.children}</>
  }
}

type TopButtonId = 'primary' | 'secondary'

const makeButton = (id: TopButtonId, opts: ButtonConfig): OptionsTopBarButton => ({
  id,
  text: opts.title,
  color: opts.isDanger ? 'red' : platform.toolbarBtnTextColor,
  enabled: !opts.disabled,
})
