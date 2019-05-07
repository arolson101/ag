import { fixUrl, generateAvatar, ImageSource, isUrl } from '@ag/util'
import debug from 'debug'
import { Field, useField, useFormikContext } from 'formik'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { defineMessages } from 'react-intl'
import { timer } from 'rxjs'
import { useEventCallback } from 'rxjs-hooks'
import { debounce, distinctUntilChanged, ignoreElements, map, tap } from 'rxjs/operators'
import { actions } from '../actions'
import {
  CommonFieldProps,
  CommonTextFieldProps,
  CoreContext,
  typedFields,
  useAction,
  useCoreStore,
  useIntl,
} from '../context'

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

type Field<T> = [{ value: T }, {}]

export const UrlField = <Values extends Record<string, any>>(props: Props<Values>) => {
  const intl = useIntl()
  const openPictureDlg = useAction(actions.openDlg.picture)
  const { ui, getImageFromLibrary, online } = useContext(CoreContext)
  const { PopoverButton, Image, Text } = ui
  const { TextField } = typedFields<Values>(ui)
  const { disabled } = props
  const { field, nameField } = props
  const { favicoWidth, favicoHeight, favicoField } = props

  const formik = useFormikContext<any>()
  const [{ value: name }] = useField(nameField) as Field<string>
  const [{ value: url }] = useField(field) as Field<string>
  const [{ value }] = useField(favicoField) as Field<ImageSource>

  const [source, setSource] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  const generateDefaultIcon = useCallback(() => {
    if (name) {
      return generateAvatar(name)
    }
  }, [name])

  useEffect(() => {
    if (source === undefined) {
      log('doing nothing')
      return
    }

    const newUrl = fixUrl(source)
    if (!isUrl(newUrl)) {
      log('not an url; setting default (%s)', newUrl)
      formik.setFieldValue(favicoField, generateDefaultIcon())
      return
    }

    log('getting from %s', newUrl)
    const cancelSource = online.CancelToken.source()

    // download image
    Promise.resolve()
      .then(() => setLoading(true))
      .then(() => online.getFavico(newUrl, cancelSource.token))
      .then(favico => {
        // log('got favico %O', favico)
        formik.setFieldValue(favicoField, ImageSource.fromImageBuf(favico))
      })
      .finally(() => setLoading(false))

    return cancelSource.cancel
  }, [source, online, generateDefaultIcon])

  const [onValueChanged] = useEventCallback<string>(event$ =>
    event$.pipe(
      map(fixUrl),
      // filter(isUrl),
      distinctUntilChanged(),
      debounce(() => timer(250)),
      tap(x => {
        log('onValueChanged: %s', x)
        setSource(x)
      }),
      ignoreElements()
    )
  )

  const onClickRedownload = useCallback(async () => {
    log('onClickRedownload (source %s) %s', source, url)
    setSource(url === source ? ' ' + url : url)
  }, [url, source])

  const onPictureChosen = useCallback(
    (val: ImageSource) => {
      formik.setFieldValue(favicoField, val)
    },
    [formik, favicoField]
  )

  const onClickSelect = useCallback(() => {
    log('openDlg.picture %s', url)
    openPictureDlg({ url, onSelected: onPictureChosen })
  }, [openPictureDlg, url, onPictureChosen])

  const onClickLibrary = useCallback(async () => {
    const val = await getImageFromLibrary(favicoWidth, favicoHeight)
    log('getImageFromLibrary from %o', val)
    if (val) {
      formik.setFieldValue(favicoField, ImageSource.fromImageBuf(val))
    }
  }, [getImageFromLibrary, favicoWidth, favicoHeight, favicoField, formik])

  const onClickReset = useCallback(() => {
    log('reset favico')
    formik.setFieldValue(favicoField, generateDefaultIcon())
  }, [favicoField, formik, generateDefaultIcon])

  return (
    <TextField
      field={props.field}
      label={props.label}
      leftIcon='url'
      disabled={disabled}
      onValueChanged={onValueChanged}
      rightElement={
        <PopoverButton
          disabled={disabled}
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
              disabled: !isUrl(url),
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
