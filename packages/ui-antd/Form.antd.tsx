import { FormProps } from '@ag/core/context'
import { Form as AntdForm } from 'antd'
import React from 'react'
import { Form as FinalForm } from 'react-final-form'

export const Form = Object.assign(
  React.memo<FormProps>(function _Form(props) {
    const { initialValues, validate, submit, submitRef, children } = props

    // TODO: preventDefault?
    // const onSubmit = useCallback(
    //   (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault()
    //     submit()
    //   },
    //   [submit]
    // )

    return (
      <FinalForm initialValues={initialValues} validate={validate} onSubmit={submit}>
        {({ handleSubmit, form, values }) => {
          if (submitRef) {
            submitRef.current = form.submit
          }
          return (
            <AntdForm style={{ flex: 1 }} layout='vertical' onSubmit={handleSubmit}>
              {typeof children === 'function'
                ? children({ change: form.change, handleSubmit, values })
                : children}
            </AntdForm>
          )
        }}
      </FinalForm>
    )
  }),
  {
    displayName: 'Form',
  }
)
