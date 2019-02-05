import {
  AppContext,
  FavicoProps,
  fixUrl,
  getFavico,
  getFavicoFromLibrary,
  UrlFieldProps,
} from '@ag/app'
import {
  Button,
  FormGroup,
  HTMLInputProps,
  IButtonProps,
  Icon,
  IInputGroupProps,
  InputGroup,
  Intent,
  Spinner,
} from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import debug from 'debug'
import { Field, FieldProps, FormikProps } from 'formik'
import isUrl = require('is-url')
import React from 'react'
import { defineMessages } from 'react-intl'

const log = debug('electron:UrlField')

export namespace UrlField {
  export type Props<Values> = UrlFieldProps<Values>
}

interface State {
  gettingIcon: boolean
}

export class UrlField<Values> extends React.PureComponent<UrlField.Props<Values>, State> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  private textInput: HTMLInputElement | null = null
  private form!: FormikProps<Values>
  private originalValue: string | undefined = undefined
  private controller = new AbortController()

  state: State = {
    gettingIcon: false,
  }

  componentWillUnmount() {
    this.controller.abort()
  }

  focusTextInput = () => {
    if (this.textInput) {
      this.textInput.focus()
    }
  }

  inputRef = (ref: HTMLInputElement | null) => {
    this.textInput = ref
  }

  render() {
    const {
      field: name,
      favicoField,
      autoFocus,
      label,
      disabled,
      placeholder,
      // returnKeyType
    } = this.props
    const id = name

    return (
      <Field name={name} pure={false}>
        {({ field, form }: FieldProps<Values>) => {
          this.form = form
          const error = !!(form.touched[name] && form.errors[name])
          const intent = error ? Intent.DANGER : undefined
          const inputProps = { autoFocus, onPress: this.focusTextInput }
          if (this.originalValue === undefined) {
            this.originalValue = field.value
          }
          return (
            <FormGroup
              intent={intent}
              helperText={error}
              label={label}
              labelFor={id}
              disabled={disabled}
            >
              <NotifyingInput
                // style={{ flex: 1 }}
                placeholder={placeholder}
                autoFocus={autoFocus}
                {...field}
                value={field.value}
                inputRef={this.inputRef}
                onValueChanged={this.onValueChanged}
                leftIcon={
                  <Field name={favicoField} pure={false}>
                    {({ field: iconField }: FieldProps<Values>) => {
                      return (
                        <FavicoButton
                          loading={this.state.gettingIcon}
                          value={iconField.value}
                          // bordered
                          onClick={this.onIconButtonPressed}
                          // style={{ alignSelf: 'center', padding: platform.buttonPadding }}
                        />
                      )
                    }}
                  </Field>
                }
              />
            </FormGroup>
          )
        }}
      </Field>
    )
  }

  onValueChanged = async (value: string) => {
    await this.maybeGetIcon(value)
  }

  maybeGetIcon = async (value: string, force: boolean = false) => {
    log('maybeGetIcon %s', value)
    const { favicoField } = this.props

    value = fixUrl(value)
    log('fixed: %s', value)

    if (!isUrl(value)) {
      log(`not looking up icon '${value}' is not an URL`)
      return
    }

    const iconValue = this.form.values[favicoField]
    if (iconValue && !force) {
      const iconProps = JSON.parse(iconValue as any) as FavicoProps
      if (iconProps.from === value) {
        log(`not looking up icon because we already got it from ${value}`)
        return
      }

      if (iconProps.from !== this.originalValue) {
        log(`not changing icon because it was from ${iconProps.from}, not ${this.originalValue}`)
        return
      }
    }

    try {
      this.setState({ gettingIcon: true })
      const icon = await getFavico(value, this.controller.signal, this.context)
      this.form.setFieldValue(favicoField, JSON.stringify(icon))
      this.originalValue = icon.from
    } catch (ex) {
      log(ex.message)
    } finally {
      this.setState({ gettingIcon: false })
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
    this.originalValue = icon.from
  }

  onIconButtonPressed = () => {
    // const { intl } = this.context
    // const { label, favicoField } = this.props
    // const options: string[] = [
    //   intl.formatMessage(messages.reset),
    //   intl.formatMessage(messages.redownload),
    //   intl.formatMessage(messages.library),
    //   intl.formatMessage(messages.cancel),
    // ]
    // const cancelButtonIndex = 3
    // ActionSheet.show(
    //   {
    //     options,
    //     cancelButtonIndex,
    //     title: label,
    //   },
    //   async buttonIndex => {
    //     switch (buttonIndex) {
    //       case 0: // reset
    //         this.form.setFieldValue(favicoField, '')
    //         return
    //       case 1: // redownload
    //         await this.redownload()
    //         break
    //       case 2: // library
    //         await this.getFromLibrary()
    //         break
    //     }
    //   }
    // )
  }
}

interface NotifyingInputProps extends IInputGroupProps {
  textRef?: (ref: HTMLInputElement | null) => any
  onValueChanged: (newValue: string, oldValue: string) => any
}

class NotifyingInput extends React.Component<NotifyingInputProps & HTMLInputProps> {
  componentDidUpdate(prevProps: NotifyingInputProps) {
    const { value, onValueChanged } = this.props
    if (prevProps.value !== value) {
      onValueChanged(value || '', prevProps.value || '')
    }
  }

  render() {
    const { textRef, onValueChanged, ...props } = this.props
    return <InputGroup {...props} inputRef={textRef} />
  }
}

interface FavicoButtonProps extends IButtonProps {
  value: string
  loading: boolean
}

class FavicoButton extends React.Component<FavicoButtonProps> {
  render() {
    const { value, loading, ...props } = this.props
    const favico = value ? (JSON.parse(value) as FavicoProps) : undefined
    return (
      <Button {...props}>
        {loading ? (
          <Spinner />
        ) : favico ? (
          // <Thumbnail style={{ backgroundColor: 'transparent' }} square small {...favico} />
          <img src={favico.source[0].uri} />
        ) : (
          <Icon icon={IconNames.BANK_ACCOUNT} />
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
