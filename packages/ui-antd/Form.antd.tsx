import { FormProps } from '@ag/core'
import { Form as AntdForm } from 'antd'
import React from 'react'

export class Form extends React.PureComponent<FormProps> {
  render() {
    const { children } = this.props
    return (
      <AntdForm style={{ flex: 1 }} onSubmit={this.onSubmit}>
        {children}
      </AntdForm>
    )
  }

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { onSubmit } = this.props
    onSubmit()
  }
}
