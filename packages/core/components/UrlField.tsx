import { fixUrl, generateAvatar, Gql, ImageSource, isUrl, useApolloClient } from '@ag/util'
import ApolloClient from 'apollo-client'
import assert from 'assert'
import debug from 'debug'
import { Field, FieldProps, FormikProps, useField, useFormikContext } from 'formik'
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
  favicoField: string
  favicoSize: number
  disabled?: boolean
}

const FavicoButton = Object.assign(
  React.memo<FavicoButtonProps>(props => {
    const { intl, ui, dispatch, getImageFromLibrary } = useContext(CoreContext)
    const { PopoverButton, Image, Text } = ui
    const { name, url, favico, favicoField, favicoSize, disabled } = props
    const [loading, setLoading] = useState(false)
    const formik = useFormikContext<any>()
    const [forceDownload, setForceDownload] = useState(0)

    const generateDefaultIcon = useCallback(() => {
      if (name) {
        return generateAvatar(name)
      }
    }, [name])

    // tslint:disable-next-line:interface-over-type-literal
    type Input = { name: string; url: string; forceDownload: number }
    log('FavicoButton render %o', props)
    const value = useObservable<ImageSource | '', Input[]>(
      input$ =>
        input$.pipe(
          //
          debounce(() => timer(5000)),
          distinctUntilChanged(),
          mergeMap(async ([{ name, url, forceDownload }]) => {
            log('getting favicon %s', url)
            if (!isUrl(url)) {
              log('not an url: %s', url)
              const icon = name ? generateAvatar(name) : ''
              formik.setFieldValue(favicoField, icon)
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
      formik.setFieldValue(favicoField, '')
      setForceDownload(forceDownload + 1)
    }, [formik, favicoField, url, setForceDownload, forceDownload])

    const onPictureChosen = useCallback(
      (source: ImageSource) => {
        formik.setFieldValue(favicoField, source)
      },
      [formik, favicoField]
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
        formik.setFieldValue(favicoField, ImageSource.fromImageBuf(source))
      }
    }, [getImageFromLibrary, favicoSize, favicoField, formik])

    const onClickReset = useCallback(() => {
      formik.setFieldValue(favicoField, generateDefaultIcon())
    }, [favicoField, formik, generateDefaultIcon])

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
  }),
  {
    displayName: 'FavicoButton',
  }
)

export const UrlField = <Values extends Record<string, any>>(props: Props<Values>) => {
  const { ui } = useContext(CoreContext)
  const { TextField } = typedFields<Values>(ui)
  const { favicoField, nameField } = props
  const { disabled, favicoWidth } = props
  const [favico] = useField(favicoField)
  const [name] = useField(props.nameField)
  const [url] = useField(props.field)

  return (
    <TextField
      field={props.field}
      label={props.label}
      leftIcon='url'
      disabled={disabled}
      rightElement={
        <FavicoButton
          name={name.value}
          url={url.value}
          disabled={disabled}
          favico={favico.value}
          favicoField={favicoField}
          favicoSize={favicoWidth}
        />
      }
    />
  )
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
