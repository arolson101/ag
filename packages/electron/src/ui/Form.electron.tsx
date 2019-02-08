import { FormProps } from '@ag/app'
import React from 'react'

export class Form extends React.PureComponent<FormProps> {
  render() {
    const { children } = this.props
    return <form onSubmit={this.onSubmit}>{children}</form>
  }

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { onSubmit } = this.props
    onSubmit()
  }
}
