import { UiContext } from '@ag/app'
import { ui as nbUi } from '@ag/ui-nativebase'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { View } from 'react-native'

const ui: UiContext = {
  ...nbUi,

  LoadingOverlay: () => null,

  Dialog: props => <View>{props.children}</View>,
  DialogBody: props => <View>{props.children}</View>,
  DialogFooter: props => <View>{props.children}</View>,
}

export { ui, storiesOf }
