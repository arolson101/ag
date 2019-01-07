import { FormProps } from '@ag/app/context'
import React from 'react'

export class Form extends React.PureComponent<FormProps> {
  render() {
    const { onSubmit, children } = this.props
    return <form onSubmit={onSubmit}>{children}</form>
  }
}
