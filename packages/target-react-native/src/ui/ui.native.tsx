import { PageProps, UiContext } from '@ag/core/context'
import { NbUi, platform } from '@ag/ui-nativebase'
import assert from 'assert'
import React, { useEffect } from 'react'
import { Navigation } from 'react-native-navigation'
import { Dialog } from './Dialog.native'
import { LoadingOverlay } from './LoadingOverlay.native'

export const ui: UiContext = {
  ...NbUi,

  Page: Object.assign(
    React.memo<PageProps>(props => {
      const { componentId, title, button } = props
      useEffect(() => {
        if (title || button) {
          if (!componentId) {
            throw new Error('no componentId passed to Page')
          }

          Navigation.mergeOptions(componentId, {
            topBar: {
              title: {
                text: title,
              },
              rightButtons: button && [
                {
                  id: 'primary',
                  text: button.title,
                  color: button.isDanger ? 'red' : platform.toolbarBtnTextColor,
                  enabled: !button.disabled,
                },
              ],
            },
          })

          const listener = Navigation.events().registerNavigationButtonPressedListener(e => {
            if (e.componentId === componentId && button) {
              assert(e.buttonId === 'primary')
              button.onClick()
            }
          })

          return () => listener.remove()
        }
      }, [componentId, title, button])
      return <NbUi.Page {...props} />
    }),
    {
      displayName: 'native.Page',
    }
  ),

  LoadingOverlay,

  Dialog,
}
