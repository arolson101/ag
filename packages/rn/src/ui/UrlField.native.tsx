import { actions, AppContext, getFavico, UrlFieldProps } from '@ag/app'
import { ImageString, memoizeOne, toImageSource, toImageString } from '@ag/app/util'
import { fixUrl, isUrl } from '@ag/app/util/url'
import debug from 'debug'
import { Field, FieldProps, FormikProps } from 'formik'
import { ActionSheet, Button, Input, Item, NativeBase, Spinner, Thumbnail } from 'native-base'
import platform from 'native-base/dist/src/theme/variables/platform'
import * as React from 'react'
import { defineMessages } from 'react-intl'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Label } from './Label.native'

const log = debug('ag:UrlField')
log.enabled = true

export namespace UrlField {
  export type Props<Values> = UrlFieldProps<Values>
}

interface State {
  gettingIcon: boolean
}

export class UrlField<Values extends Record<string, any>> extends React.PureComponent<
  UrlField.Props<Values>,
  State
> {
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

    try {
      if (this.controller) {
        this.controller.abort()
      }
      this.controller = new AbortController()
      this.setState({ gettingIcon: true })
      const icon = await getFavico(value, this.controller.signal, this.context)
      this.form.setFieldValue(favicoField, toImageString(icon))
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

  selectImage = async () => {
    const { field } = this.props
    const { dispatch } = this.context
    const url = fixUrl(this.form.values[field])
    if (isUrl(url)) {
      dispatch(actions.openDlg.picture({ url, onSelected: this.onPictureChosen }))
    }
  }

  onPictureChosen = (uri: ImageString) => {
    const { favicoField } = this.props
    this.form.setFieldValue(favicoField, uri)
  }

  getFromLibrary = async () => {
    const { field, favicoField } = this.props
    const { getImageFromLibrary } = this.context
    const from = this.form.values[field]
    const source = await getImageFromLibrary()
    // log('getFromLibrary from %s %o', from, source)
    if (source) {
      this.form.setFieldValue(favicoField, toImageString(source))
    }
  }

  onIconButtonPressed = () => {
    const { intl } = this.context
    const { favicoField } = this.props
    const options: string[] = [
      intl.formatMessage(messages.redownload),
      intl.formatMessage(messages.selectImage),
      intl.formatMessage(messages.library),
      intl.formatMessage(messages.reset),
      intl.formatMessage(messages.cancel),
    ]
    const cancelButtonIndex = options.length - 1
    ActionSheet.show(
      {
        options,
        cancelButtonIndex,
        title: intl.formatMessage(messages.title),
      },
      async buttonIndex => {
        switch (buttonIndex) {
          case 0: // redownload
            await this.redownload()
            break
          case 1: // selectImage
            await this.selectImage()
            break
          case 2: // library
            await this.getFromLibrary()
            break
          case 3: // reset
            this.form.setFieldValue(favicoField, '')
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
  decodeImage = memoizeOne(toImageSource)

  render() {
    const { value, loading, ...props } = this.props
    // log('render %o', favico)
    return (
      <Button {...props}>
        {loading ? (
          <Spinner />
        ) : value ? (
          <Thumbnail
            style={{ backgroundColor: 'transparent' }}
            square
            small
            source={this.decodeImage(value)!}
          />
        ) : (
          <FontAwesome name='bank' />
        )}
      </Button>
    )
  }
}

const messages = defineMessages({
  title: {
    id: 'UrlField.native.title',
    defaultMessage: 'Customize Image',
  },
  library: {
    id: 'UrlField.native.library',
    defaultMessage: 'Choose from library...',
  },
  reset: {
    id: 'UrlField.native.reset',
    defaultMessage: 'Reset to default',
  },
  redownload: {
    id: 'UrlField.native.redownload',
    defaultMessage: 'Download again',
  },
  selectImage: {
    id: 'UrlField.native.selectImage',
    defaultMessage: 'Choose image...',
  },
  cancel: {
    id: 'UrlField.native.cancel',
    defaultMessage: 'Cancel',
  },
})
