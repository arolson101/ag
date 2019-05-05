import { ButtonConfig, CoreContext, DialogProps } from '@ag/core'
import { platform } from '@ag/ui-nativebase'
import debug from 'debug'
import React, { useContext, useEffect } from 'react'
import { Platform } from 'react-native'
import { Navigation, OptionsTopBarButton } from 'react-native-navigation'

const log = debug('rn:dialog')

export interface DialogContext extends CoreContext {
  componentId: string
}
export const DialogContext = React.createContext<DialogContext>({ componentId: 'NONE' } as any)
DialogContext.displayName = `DialogContext`

export const Dialog = Object.assign(
  React.memo<DialogProps>(function _Dialog(props) {
    const { title, primary, secondary, children } = props
    const { componentId } = useContext(DialogContext)
    useEffect(() => {
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
    }, [componentId])

    useEffect(() => {
      // log('setting buttons')
      Navigation.mergeOptions(componentId, {
        topBar:
          Platform.OS === 'ios'
            ? {
                rightButtons: primary && [makeButton('primary', primary)],
                leftButtons: secondary && [makeButton('secondary', secondary)],
              }
            : {
                rightButtons: [
                  ...(primary ? [makeButton('primary', primary)] : []),
                  ...(secondary ? [makeButton('secondary', secondary)] : []),
                ],
              },
      })

      const listener = Navigation.events().registerNavigationButtonPressedListener(e => {
        if (e.componentId === componentId) {
          props[e.buttonId as TopButtonId]!.onClick()
        }
      })

      return listener.remove
    }, [componentId])

    return <>{children}</>
  }),
  {
    displayName: 'Dialog',
  }
)

type TopButtonId = 'primary' | 'secondary'

const makeButton = (id: TopButtonId, opts: ButtonConfig): OptionsTopBarButton => ({
  id,
  text: opts.title,
  color: opts.isDanger ? 'red' : platform.toolbarBtnTextColor,
  enabled: !opts.disabled,
})
