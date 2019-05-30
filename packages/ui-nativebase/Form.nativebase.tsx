import { CommonTextFieldProps, FormProps } from '@ag/core/context'
import { useSubmitRef } from '@ag/util'
import debug from 'debug'
import * as NB from 'native-base'
import platform from 'native-base/dist/src/theme/variables/platform'
import React, { useCallback, useRef } from 'react'
import { Form as FinalForm } from 'react-final-form'
import { StyleSheet } from 'react-native'

const log = debug('ui-nativebase:Form')

export interface FormContextChild {
  focus: () => any
  props: {
    field: string
  }
  setCommonTextFieldProps: (props: CommonTextFieldProps) => any
}

export interface FormContext {
  addField: (field: FormContextChild) => any
  rmvField: (field: FormContextChild) => any
}
export const FormContext = React.createContext<FormContext>(null as any)

export const Form = Object.assign(
  React.memo<FormProps>(function _Form({
    initialValues,
    validate,
    submit,
    lastFieldSubmit,
    submitRef,
    children,
  }) {
    const fieldNames = useRef<string[]>([])
    const fields = useRef<Record<string, FormContextChild>>({})
    const submitRef2 = useSubmitRef()

    const updateFields = useCallback(
      function _updateFields() {
        // log('updateFields %o', this)
        const fields1 = fieldNames.current //
          .map(name => fields.current[name])
          .filter(field => !!field)

        for (let i = 0; i < fields1.length; i++) {
          const current = fields1[i]
          const next = fields1[i + 1]
          current.setCommonTextFieldProps({
            returnKeyType: next ? 'next' : lastFieldSubmit ? 'done' : undefined,
            blurOnSubmit: !next,
            onSubmitEditing: next ? next.focus : lastFieldSubmit ? submitRef2.current : undefined,
          })
        }
      },
      [fieldNames.current, fields.current]
    )

    const addField = useCallback(
      function _addField(field: FormContextChild) {
        const name = field.props.field
        // log('addField: %s %o', name, this)
        if (!fieldNames.current.includes(name)) {
          fieldNames.current.push(name)
        }
        fields.current[name] = field
        updateFields()
      },
      [fieldNames.current, fields.current, updateFields]
    )

    const rmvField = useCallback(
      function _rmvField(field: FormContextChild) {
        const name = field.props.field
        // log('rmvField: %s %o', name, this)
        delete fields.current[name]
        updateFields()
      },
      [fields.current, updateFields]
    )

    return (
      <FinalForm initialValues={initialValues} validate={validate} onSubmit={submit}>
        {({ handleSubmit, form, values }) => {
          submitRef2.current = handleSubmit
          if (submitRef) {
            submitRef.current = handleSubmit
          }
          return (
            <FormContext.Provider value={{ addField, rmvField }}>
              <NB.Form style={styles.form}>
                {typeof children === 'function'
                  ? children({ change: form.change, handleSubmit, values })
                  : children}
              </NB.Form>
            </FormContext.Provider>
          )
        }}
      </FinalForm>
    )
  }),
  {
    displayName: 'Form',
  }
)

const styles = StyleSheet.create({
  form: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: platform.cardDefaultBg,
  },
})
