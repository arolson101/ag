import { FormProps } from '@ag/app'
import * as NB from 'native-base'
import platform from 'native-base/dist/src/theme/variables/platform'
import React from 'react'

export class Form<Values> extends React.PureComponent<FormProps<Values>> {
  render() {
    const { children } = this.props
    return <NB.Form style={{ backgroundColor: platform.cardDefaultBg }}>{children}</NB.Form>
  }
}
