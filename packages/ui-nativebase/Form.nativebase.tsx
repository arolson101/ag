import { AppContext, CommonTextFieldProps, FormProps } from '@ag/core'
import debug from 'debug'
import * as NB from 'native-base'
import platform from 'native-base/dist/src/theme/variables/platform'
import React from 'react'
import { StyleSheet } from 'react-native'

const log = debug('ui-nativebase:Form')

export interface FormContextChild {
  focus: () => any
  props: {
    field: string
  }
  setCommonTextFieldProps: (props: CommonTextFieldProps) => any
}

export interface FormContext extends AppContext {
  addField: (field: FormContextChild) => any
  rmvField: (field: FormContextChild) => any
}
export const FormContext = React.createContext<FormContext>(null as any)

export class Form<Values> extends React.PureComponent<FormProps<Values>> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  render() {
    const { children } = this.props
    const value: FormContext = { ...this.context, addField: this.addField, rmvField: this.rmvField }
    return (
      <FormContext.Provider value={value}>
        <NB.Form style={styles.form}>{children}</NB.Form>
      </FormContext.Provider>
    )
  }

  private fieldNames: string[] = []
  private fields: Record<string, FormContextChild> = {}

  addField = (field: FormContextChild) => {
    const name = field.props.field
    // log('addField: %s %o', name, this)
    if (!this.fieldNames.includes(name)) {
      this.fieldNames.push(name)
    }
    this.fields[name] = field
    this.updateFields()
  }

  rmvField = (field: FormContextChild) => {
    const name = field.props.field
    // log('rmvField: %s %o', name, this)
    delete this.fields[name]
    this.updateFields()
  }

  updateFields = () => {
    // log('updateFields %o', this)
    const { onSubmit, lastFieldSubmit } = this.props
    const fields = this.fieldNames.map(name => this.fields[name]).filter(field => !!field)
    for (let i = 0; i < fields.length; i++) {
      const current = fields[i]
      const next = fields[i + 1]
      current.setCommonTextFieldProps({
        returnKeyType: next ? 'next' : lastFieldSubmit ? 'done' : undefined,
        blurOnSubmit: !next,
        onSubmitEditing: next ? next.focus : lastFieldSubmit ? onSubmit : undefined,
      })
    }
  }
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: platform.cardDefaultBg,
  },
})
