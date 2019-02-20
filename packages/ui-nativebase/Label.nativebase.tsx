import { Label as NBLabel } from 'native-base'
import platform from 'native-base/dist/src/theme/variables/platform'
import * as React from 'react'

export namespace Label {
  export interface Props {
    error?: boolean
    label: string
  }
}

export class Label extends React.PureComponent<Label.Props> {
  render() {
    const { label, error } = this.props
    return (
      <NBLabel style={{ color: error ? platform.inputErrorBorderColor : platform.listNoteColor }}>
        {label}
      </NBLabel>
    )
  }
}
