import { FormProps } from '@ag/app'
import * as NB from 'native-base'
import platform from 'native-base/dist/src/theme/variables/platform'
import React from 'react'
import { StyleSheet } from 'react-native'

export class Form<Values> extends React.PureComponent<FormProps<Values>> {
  render() {
    const { children } = this.props
    return <NB.Form style={styles.form}>{children}</NB.Form>
  }
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: platform.cardDefaultBg,
  },
})
