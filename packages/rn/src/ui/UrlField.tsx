import { AppContext, UrlFieldProps } from '@ag/app'
import { FavicoProps, fixUrl, getFavico, getFavicoFromLibrary } from '@ag/app/online/getFavico'
import debug from 'debug'
import { Field, FieldProps, FormikProps } from 'formik'
import isUrl from 'is-url'
import { ActionSheet, Button, Input, Item, NativeBase, Spinner, Thumbnail } from 'native-base'
import platform from 'native-base/dist/src/theme/variables/platform'
import * as React from 'react'
import { defineMessages } from 'react-intl'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Label } from './Label'

const log = debug('ag:UrlField')
log.enabled = true

export namespace UrlField {
  export type Props<Values> = UrlFieldProps<Values>
}

interface State {
  gettingIcon: boolean
}

export class UrlField<Values> extends React.PureComponent<UrlField.Props<Values>, State> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  private textInput = React.createRef<Input>()
  private form!: FormikProps<Values>
  private controller?: AbortController

  state: State = {
    gettingIcon: false,
  }

  componentWillUnmount() {
    if (this.controller) {
      this.controller.abort()
    }
  }

  focusTextInput = () => {
    const ref: any = this.textInput.current
    if (ref && ref._root) {
      ref._root.focus()
    }
  }

  render() {
    const {
      field: name,
      favicoField,
      autoFocus,
      label,
      placeholder,
      onSubmitEditing,
      // returnKeyType
    } = this.props
    return (
      <Field name={name} pure={false}>
        {({ field, form }: FieldProps<Values>) => {
          this.form = form
          const error = !!(form.touched[name] && form.errors[name])
          const inputProps = { autoFocus, onPress: this.focusTextInput }
          return (
            <Item inlineLabel error={error} {...inputProps} placeholder={placeholder}>
              <Label label={label} error={error} />

              <Field name={favicoField} pure={false}>
                {({ field: iconField }: FieldProps<Values>) => {
                  return (
                    <FavicoButton
                      loading={this.state.gettingIcon}
                      value={iconField.value}
                      bordered
                      onPress={this.onIconButtonPressed}
                      style={{ alignSelf: 'center', padding: platform.buttonPadding }}
                    />
                  )
                }}
              </Field>

              <NotifyingInput
                style={{ flex: 1 }}
                keyboardType='url'
                autoFocus={autoFocus}
                onChangeText={text => form.setFieldValue(name, text)}
                value={field.value}
                onSubmitEditing={onSubmitEditing}
                // returnKeyType={returnKeyType}
                textRef={this.textInput}
                onValueChanged={this.onValueChanged}
              />
            </Item>
          )
        }}
      </Field>
    )
  }

  onValueChanged = async (value: string) => {
    await this.maybeGetIcon(value)
  }

  maybeGetIcon = async (value: string, force: boolean = false) => {
    log('maybeGetIcon', { value })
    const { favicoField } = this.props

    value = fixUrl(value)
    // log('fixed: %s', value)

    if (!isUrl(value)) {
      log(`not looking up icon '${value}' is not an URL`)
      this.form.setFieldValue(favicoField, undefined)
      return
    }

    const iconValue = this.form.values[favicoField]
    if (iconValue && !force) {
      const iconProps = JSON.parse(iconValue as any) as FavicoProps
      if (iconProps.from === value) {
        log(`not looking up icon because we already got it from ${value}`)
        return
      }
    }

    try {
      if (this.controller) {
        this.controller.abort()
      }
      this.controller = new AbortController()
      this.setState({ gettingIcon: true })
      const icon = await getFavico(value, this.controller.signal, this.context)
      this.form.setFieldValue(favicoField, JSON.stringify(icon))
    } catch (ex) {
      log(ex.message)
    } finally {
      this.setState({ gettingIcon: false })
      this.controller = undefined
    }
  }

  redownload = async () => {
    const { favicoField, field } = this.props
    this.form.setFieldValue(favicoField, '')
    return this.maybeGetIcon(this.form.values[field] as any, true)
  }

  getFromLibrary = async () => {
    const { favicoField } = this.props
    const icon = await getFavicoFromLibrary(this.context)
    this.form.setFieldValue(favicoField, JSON.stringify(icon))
  }

  onIconButtonPressed = () => {
    const { intl } = this.context
    const { label, favicoField } = this.props
    const options: string[] = [
      intl.formatMessage(messages.reset),
      intl.formatMessage(messages.redownload),
      intl.formatMessage(messages.library),
      intl.formatMessage(messages.cancel),
    ]
    const cancelButtonIndex = 3
    ActionSheet.show(
      {
        options,
        cancelButtonIndex,
        title: label,
      },
      async buttonIndex => {
        switch (buttonIndex) {
          case 0: // reset
            this.form.setFieldValue(favicoField, '')
            return
          case 1: // redownload
            await this.redownload()
            break
          case 2: // library
            await this.getFromLibrary()
            break
        }
      }
    )
  }
}

interface NotifyingInputProps extends NativeBase.Input {
  textRef?: React.Ref<Input>
  onValueChanged: (newValue: string, oldValue: string) => any
}

class NotifyingInput extends React.Component<NotifyingInputProps> {
  componentDidUpdate(prevProps: NotifyingInputProps) {
    const { value, onValueChanged } = this.props
    if (prevProps.value !== value) {
      onValueChanged(value || '', prevProps.value || '')
    }
  }

  render() {
    return <Input {...this.props} ref={this.props.textRef} />
  }
}

interface FavicoButtonProps extends NativeBase.Button {
  value: string
  loading: boolean
}

class FavicoButton extends React.Component<FavicoButtonProps> {
  render() {
    const { value, loading, ...props } = this.props
    const favico = value ? (JSON.parse(value) as FavicoProps) : undefined
    // log('render %o', favico)
    return (
      <Button {...props}>
        {loading ? (
          <Spinner />
        ) : favico ? (
          <Thumbnail style={{ backgroundColor: 'transparent' }} square small {...favico} />
        ) : (
          <FontAwesome name='bank' />
        )}
      </Button>
    )
  }
}

const messages = defineMessages({
  empty: {
    id: 'empty',
    defaultMessage: '',
  },
  library: {
    id: 'UrlField.library',
    defaultMessage: 'Choose from library',
  },
  reset: {
    id: 'UrlField.reset',
    defaultMessage: 'Reset to default',
  },
  redownload: {
    id: 'UrlField.redownload',
    defaultMessage: 'Download again',
  },
  cancel: {
    id: 'UrlField.cancel',
    defaultMessage: 'Cancel',
  },
})
