import { fixUrl, generateAvatar, Gql, ImageSource, isUrl, useApolloClient } from '@ag/util'
import ApolloClient from 'apollo-client'
import assert from 'assert'
import debug from 'debug'
import { Field, FieldProps, FormikProps } from 'formik'
import gql from 'graphql-tag'
import React, { useCallback, useContext, useRef, useState } from 'react'
import { ApolloConsumer } from 'react-apollo'
import { defineMessages } from 'react-intl'
import { Observable, timer } from 'rxjs'
import { useEventCallback, useObservable } from 'rxjs-hooks'
import { debounce, delay, distinctUntilChanged, map, mergeMap } from 'rxjs/operators'
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

type UrlFieldGeneric = <Values extends Record<string, any>>(
  p: Props<Values>
) => React.ReactElement<Props<Values>>

interface FavicoButtonProps {
  name: string
  url: string
  favico: ImageSource
  form: FormikProps<any>
  favicoField: string
  favicoSize: number
  disabled?: boolean
}

const FavicoButton: React.FC<FavicoButtonProps> = props => {
  const { intl, ui, dispatch, getImageFromLibrary } = useContext(CoreContext)
  const { PopoverButton, Image, Text } = ui
  const { name, url, favico, form, favicoField, favicoSize, disabled } = props
  const [loading, setLoading] = useState(false)
  const [forceDownload, setForceDownload] = useState(0)

  const generateDefaultIcon = useCallback(() => {
    if (name) {
      return generateAvatar(name)
    }
  }, [name])

  // tslint:disable-next-line:interface-over-type-literal
  type Input = { name: string; url: string; forceDownload: number }
  log('FavicoButton render %o', { name, url, forceDownload })
  const value = useObservable<ImageSource, Input[]>(
    input$ =>
      input$.pipe(
        //
        debounce(() => timer(500)),
        distinctUntilChanged(),
        mergeMap(async ([{ name, url, forceDownload }]) => {
          log('getting favicon %s', url)
          if (!isUrl(url)) {
            log('not an url: %s', url)
            const icon = name ? generateAvatar(name) : new ImageSource()
            form.setFieldValue(favicoField, icon)
            return icon
          }

          try {
            setLoading(true)

            // download image
          } finally {
            setLoading(false)
          }
          return favico
        }),
        distinctUntilChanged()
      ),
    favico,
    [{ name, url: fixUrl(url), forceDownload }]
  )

  const onClickRedownload = useCallback(async () => {
    form.setFieldValue(favicoField, '')
    setForceDownload(forceDownload + 1)
  }, [form, favicoField, url, setForceDownload, forceDownload])

  const onPictureChosen = useCallback(
    (source: ImageSource) => {
      form.setFieldValue(favicoField, source)
    },
    [form, favicoField]
  )

  const onClickSelect = useCallback(() => {
    if (isUrl(url)) {
      dispatch(actions.openDlg.picture({ url, onSelected: onPictureChosen }))
    }
  }, [url, dispatch, onPictureChosen])

  const onClickLibrary = useCallback(async () => {
    const source = await getImageFromLibrary(favicoSize, favicoSize)
    // log('getImageFromLibrary from %o', source)
    if (source) {
      form.setFieldValue(favicoField, ImageSource.fromImageBuf(source))
    }
  }, [getImageFromLibrary, favicoSize, favicoField, form])

  const onClickReset = useCallback(() => {
    form.setFieldValue(favicoField, generateDefaultIcon())
  }, [favicoField, form, generateDefaultIcon])

  return (
    <PopoverButton
      disabled={props.disabled}
      content={[
        {
          text: intl.formatMessage(messages.redownload),
          icon: 'refresh',
          onClick: onClickRedownload,
        },
        {
          text: intl.formatMessage(messages.selectImage),
          icon: 'image',
          onClick: onClickSelect,
        },
        {
          text: intl.formatMessage(messages.library),
          icon: 'library',
          onClick: onClickLibrary,
        },
        {
          divider: true,
        },
        {
          text: intl.formatMessage(messages.reset),
          icon: 'trash',
          onClick: onClickReset,
        },
      ]}
      minimal
      loading={loading}
      icon={value && value.width ? <Image size={20} src={value} /> : undefined}
    >
      {!loading && (!value || !value.width) && <Text>...</Text>}
    </PopoverButton>
  )
}

export const UrlField = <Values extends Record<string, any>>(props1: Props<Values>) => {
  const { ui } = useContext(CoreContext)
  const { TextField } = typedFields<Values>(ui)
  const { favicoField, nameField, ...props } = props1
  const { field, disabled, favicoWidth } = props

  return (
    <>
      <TextField
        {...props}
        leftIcon='url'
        rightElement={
          <Field name={favicoField} pure={false}>
            {({ field: iconField, form }: FieldProps<Values>) => {
              const value = iconField.value as ImageSource
              return (
                <FavicoButton
                  name={form.values[nameField]}
                  url={form.values[field]}
                  disabled={disabled}
                  favico={value}
                  form={form}
                  favicoField={favicoField}
                  favicoSize={favicoWidth}
                />
              )
            }}
          </Field>
        }
      />
    </>
  )
}

// export class UrlField<Values extends Record<string, any>> extends React.PureComponent<
//   Props<Values>,
//   State
// > {
//   static contextType = CoreContext
//   context!: React.ContextType<typeof CoreContext>

//   static readonly queries = {
//     getFavico: gql`
//       query GetFavico($url: String!, $cancelToken: String!) {
//         getFavico(url: $url, cancelToken: $cancelToken)
//       }
//     ` as Gql<T.GetFavico.Query, T.GetFavico.Variables>,
//   }

//   form!: FormikProps<Values>
//   client!: ApolloClient<any>
//   cancelToken?: string

//   constructor(props: Props) {
//     super(props)

//     this.state = {
//       gettingIcon: false,
//     }
//   }

//   initCancelToken() {
//     const { uniqueId } = this.context
//     if (!this.cancelToken) {
//       this.cancelToken = this.props.cancelToken || uniqueId()
//     }
//     return this.cancelToken
//   }

//   componentWillUnmount() {
//     this.cancel()
//   }

//   cancel = async () => {
//     if (this.client && this.cancelToken) {
//       return cancelOperation(this.client, this.cancelToken)
//     }
//   }

//   render() {
//     const { intl, ui } = this.context
//     const { PopoverButton, Image, Text } = ui
//     const { TextField } = typedFields<Values>(ui)
//     const { favicoField, ...props } = this.props
//     const { gettingIcon } = this.state

//     return (
//       <>
//         <ApolloConsumer>
//           {client => {
//             this.client = client
//             return null
//           }}
//         </ApolloConsumer>
//         <TextField
//           {...props}
//           onValueChanged={this.onValueChanged}
//           leftIcon='url'
//           rightElement={
//             <Field name={favicoField} pure={false}>
//               {({ field: iconField, form }: FieldProps<Values>) => {
//                 this.form = form
//                 const value = iconField.value as ImageSource
//                 return <FavicoButton />
//               }}
//             </Field>
//           }
//         />
//       </>
//     )
//   }

//   onValueChanged = async (value: string) => {
//     await this.maybeGetIcon(value)
//   }

//   generateDefaultIcon() {
//     const { nameField } = this.props
//     const name = this.form.values[nameField]
//     if (name) {
//       return generateAvatar(name)
//     }
//   }

//   maybeGetIcon = async (value: string, force: boolean = false) => {
//     log('maybeGetIcon %s', value)
//     const { favicoField } = this.props
//     value = fixUrl(value)
//     // log('fixed: %s', value)
//     if (!isUrl(value)) {
//       // log(`not looking up icon '${value}' is not an URL`)
//       this.form.setFieldValue(favicoField, this.generateDefaultIcon())
//       return
//     }
//     try {
//       this.cancel()
//       this.setState({ gettingIcon: true })

//       const cancelToken = this.initCancelToken()
//       const result = await this.client.query<T.GetFavico.Query, T.GetFavico.Variables>({
//         query: UrlField.queries.getFavico,
//         variables: { url: value, cancelToken },
//       })

//       // log('favico query: %O', {
//       //   request: { query: 'UrlField.queries.getFavico', variables: { url: value, cancelToken } },
//       //   result,
//       // })

//       assert(!result.loading)
//       const icon = result.data!.getFavico

//       this.form.setFieldValue(favicoField, icon)
//       this.setState({ gettingIcon: false })
//     } catch (ex) {
//       if (!isCancel(ex)) {
//         this.form.setFieldValue(favicoField, this.generateDefaultIcon())
//         this.setState({ gettingIcon: false })
//       }
//     }
//   }

//   onClickRedownload = async () => {
//     const { favicoField, field } = this.props
//     this.form.setFieldValue(favicoField, '')
//     return this.maybeGetIcon(this.form.values[field], true)
//   }

//   onClickSelect = () => {
//     const { field } = this.props
//     const { dispatch } = this.context
//     const url = fixUrl(this.form.values[field])
//     if (isUrl(url)) {
//       dispatch(actions.openDlg.picture({ url, onSelected: this.onPictureChosen }))
//     }
//   }

//   onPictureChosen = (source: ImageSource) => {
//     const { favicoField } = this.props
//     this.form.setFieldValue(favicoField, source)
//   }

//   onClickLibrary = async () => {
//     const { favicoField, favicoWidth, favicoHeight } = this.props
//     const { getImageFromLibrary } = this.context
//     const source = await getImageFromLibrary(favicoWidth, favicoHeight)
//     // log('getImageFromLibrary from %o', source)
//     if (source) {
//       this.form.setFieldValue(favicoField, ImageSource.fromImageBuf(source))
//     }
//   }

//   onClickReset = () => {
//     const { favicoField } = this.props
//     this.form.setFieldValue(favicoField, this.generateDefaultIcon())
//   }
// }

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
