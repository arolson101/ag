import { fixUrl, generateAvatar, Gql, ImageSource, isUrl } from '@ag/util'
import ApolloClient from 'apollo-client'
import assert from 'assert'
import debug from 'debug'
import { Field, FieldProps, FormikProps } from 'formik'
import gql from 'graphql-tag'
import React from 'react'
import { ApolloConsumer } from 'react-apollo'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { CommonFieldProps, CommonTextFieldProps, CoreContext, typedFields } from '../context'
import * as T from '../graphql-types'
import { cancelOperation, isCancel } from './cancelOperation'

const log = debug('core:UrlField')

interface State {
  gettingIcon: boolean
}

interface Props<Values = any> extends CommonFieldProps<Values>, CommonTextFieldProps {
  nameField: keyof Values & string
  favicoField: keyof Values & string
  favicoWidth: number
  favicoHeight: number
  placeholder?: string
  cancelToken?: string
}

export class UrlField<Values extends Record<string, any>> extends React.PureComponent<
  Props<Values>,
  State
> {
  static contextType = CoreContext
  context!: React.ContextType<typeof CoreContext>

  static readonly queries = {
    getFavico: gql`
      query GetFavico($url: String!, $cancelToken: String!) {
        getFavico(url: $url, cancelToken: $cancelToken)
      }
    ` as Gql<T.GetFavico.Query, T.GetFavico.Variables>,
  }

  form!: FormikProps<Values>
  client!: ApolloClient<any>
  cancelToken?: string

  constructor(props: Props) {
    super(props)

    this.state = {
      gettingIcon: false,
    }
  }

  initCancelToken() {
    const { uniqueId } = this.context
    if (!this.cancelToken) {
      this.cancelToken = this.props.cancelToken || uniqueId()
    }
    return this.cancelToken
  }

  componentWillUnmount() {
    this.cancel()
  }

  cancel = async () => {
    if (this.client && this.cancelToken) {
      return cancelOperation(this.client, this.cancelToken)
    }
  }

  render() {
    const { intl, ui } = this.context
    const { PopoverButton, Image, Text } = ui
    const { TextField } = typedFields<Values>(ui)
    const { favicoField, ...props } = this.props
    const { gettingIcon } = this.state

    return (
      <>
        <ApolloConsumer>
          {client => {
            this.client = client
            return null
          }}
        </ApolloConsumer>
        <TextField
          {...props}
          onValueChanged={this.onValueChanged}
          leftIcon='url'
          rightElement={
            <Field name={favicoField} pure={false}>
              {({ field: iconField, form }: FieldProps<Values>) => {
                this.form = form
                const value = iconField.value as ImageSource
                return (
                  <PopoverButton
                    disabled={props.disabled}
                    content={[
                      {
                        text: intl.formatMessage(messages.redownload),
                        icon: 'refresh',
                        onClick: this.onClickRedownload,
                      },
                      {
                        text: intl.formatMessage(messages.selectImage),
                        icon: 'image',
                        onClick: this.onClickSelect,
                      },
                      {
                        text: intl.formatMessage(messages.library),
                        icon: 'library',
                        onClick: this.onClickLibrary,
                      },
                      {
                        divider: true,
                      },
                      {
                        text: intl.formatMessage(messages.reset),
                        icon: 'trash',
                        onClick: this.onClickReset,
                      },
                    ]}
                    minimal
                    loading={gettingIcon}
                    icon={value && value.width ? <Image size={20} src={value} /> : undefined}
                  >
                    {!gettingIcon && (!value || !value.width) && <Text>...</Text>}
                  </PopoverButton>
                )
              }}
            </Field>
          }
        />
      </>
    )
  }

  onValueChanged = async (value: string) => {
    await this.maybeGetIcon(value)
  }

  generateDefaultIcon() {
    const { nameField } = this.props
    const name = this.form.values[nameField]
    if (name) {
      return generateAvatar(name)
    }
  }

  maybeGetIcon = async (value: string, force: boolean = false) => {
    log('maybeGetIcon %s', value)
    const { favicoField } = this.props
    value = fixUrl(value)
    // log('fixed: %s', value)
    if (!isUrl(value)) {
      // log(`not looking up icon '${value}' is not an URL`)
      this.form.setFieldValue(favicoField, this.generateDefaultIcon())
      return
    }
    try {
      this.cancel()
      this.setState({ gettingIcon: true })

      const cancelToken = this.initCancelToken()
      const result = await this.client.query<T.GetFavico.Query, T.GetFavico.Variables>({
        query: UrlField.queries.getFavico,
        variables: { url: value, cancelToken },
      })

      // log('favico query: %O', {
      //   request: { query: 'UrlField.queries.getFavico', variables: { url: value, cancelToken } },
      //   result,
      // })

      assert(!result.loading)
      const icon = result.data!.getFavico

      this.form.setFieldValue(favicoField, icon)
      this.setState({ gettingIcon: false })
    } catch (ex) {
      if (!isCancel(ex)) {
        this.form.setFieldValue(favicoField, this.generateDefaultIcon())
        this.setState({ gettingIcon: false })
      }
    }
  }

  onClickRedownload = async () => {
    const { favicoField, field } = this.props
    this.form.setFieldValue(favicoField, '')
    return this.maybeGetIcon(this.form.values[field], true)
  }

  onClickSelect = () => {
    const { field } = this.props
    const { dispatch } = this.context
    const url = fixUrl(this.form.values[field])
    if (isUrl(url)) {
      dispatch(actions.openDlg.picture({ url, onSelected: this.onPictureChosen }))
    }
  }

  onPictureChosen = (source: ImageSource) => {
    const { favicoField } = this.props
    this.form.setFieldValue(favicoField, source)
  }

  onClickLibrary = async () => {
    const { favicoField, favicoWidth, favicoHeight } = this.props
    const { getImageFromLibrary } = this.context
    const source = await getImageFromLibrary(favicoWidth, favicoHeight)
    // log('getImageFromLibrary from %o', source)
    if (source) {
      this.form.setFieldValue(favicoField, ImageSource.fromImageBuf(source))
    }
  }

  onClickReset = () => {
    const { favicoField } = this.props
    this.form.setFieldValue(favicoField, this.generateDefaultIcon())
  }
}

const messages = defineMessages({
  library: {
    id: 'UrlField.electron.library',
    defaultMessage: 'Browse...',
  },
  reset: {
    id: 'UrlField.electron.reset',
    defaultMessage: 'Clear',
  },
  redownload: {
    id: 'UrlField.electron.redownload',
    defaultMessage: 'Download again',
  },
  selectImage: {
    id: 'UrlField.electron.selectImage',
    defaultMessage: 'Choose image...',
  },
})
