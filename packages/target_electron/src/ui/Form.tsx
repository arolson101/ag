import { FormProps } from '@ag/app/context'
import React from 'react'

export class Form extends React.PureComponent<FormProps> {
  render() {
    const { children } = this.props
    return <form onSubmit={this.onSubmit}>{children}</form>
  }

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log('form onsubmit')
    event.preventDefault()
    const { onSubmit } = this.props
    onSubmit()
  }
}
