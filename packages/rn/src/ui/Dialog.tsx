import {
  actions,
  AppContext,
  ButtonConfig,
  DialogFooterProps,
  DialogProps,
  UiContext,
} from '@ag/app'
import debug from 'debug'
import { Root, Text } from 'native-base'
import React from 'react'
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
    const { dispatch, componentId } = this.context
    dispatch(actions.dlg.mounted({ componentId }))
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

  componentWillUnmount() {
    const { dispatch, componentId } = this.context
    dispatch(actions.dlg.unmounted({ componentId }))
  }

  render() {
    return <Root>{this.props.children}</Root>
  }
}

export const DialogBody: UiContext['DialogBody'] = ({ children }) => <>{children}</>

type TopButtonId = 'primary' | 'secondary'

export class DialogFooter extends React.PureComponent<DialogFooterProps> {
  static contextType = DialogContext
  context!: React.ContextType<typeof DialogContext>

  componentDidMount() {
    log('componentDidMount')
    this.setButtons()
  }

  componentDidUpdate(prevProps: DialogFooterProps) {
    log('componentDidUpdate')
    this.setButtons()
  }

  setButtons() {
    const { primary, secondary } = this.props
    const { componentId } = this.context

    log('setting buttons')
    Navigation.mergeOptions(componentId, {
      topBar: {
        rightButtons: [makeButton('primary', primary)],
        leftButtons: secondary && [makeButton('secondary', secondary)],
      },
    })

    Navigation.events().bindComponent(this, componentId)
  }

  navigationButtonPressed(e: NavigationButtonPressedEvent) {
    log('navigationButtonPressed: %o', e)
    switch (e.buttonId as TopButtonId) {
      case 'primary':
        this.props.primary.onClick()
        break

      case 'secondary':
        this.props.secondary!.onClick()
        break
    }
  }

  render() {
    return null
  }
}

const makeButton = (id: TopButtonId, opts: ButtonConfig): OptionsTopBarButton => ({
  id,
  text: opts.title,
  color: opts.isDanger ? 'red' : undefined,
})
