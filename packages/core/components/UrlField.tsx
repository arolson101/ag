import { fixUrl, generateAvatar, imageBufToUri, ImageUri, isUrl } from '@ag/util'
import debug from 'debug'
import { useField, useFormikContext } from 'formik'
import React, { useCallback, useEffect, useState } from 'react'
import { defineMessages } from 'react-intl'
import { timer } from 'rxjs'
import { useEventCallback } from 'rxjs-hooks'
import { debounce, distinctUntilChanged, ignoreElements, map, tap } from 'rxjs/operators'
import { actions } from '../actions'
import {
  CommonFieldProps,
  CommonTextFieldProps,
  typedFields,
  useAction,
  useIntl,
  useOnline,
  useSystem,
  useUi,
} from '../context'

const log = debug('core:UrlField')

interface Props<Values = any> extends CommonFieldProps<Values>, CommonTextFieldProps {
  nameField: keyof Values & string
  favicoField: keyof Values & string
  favicoWidth: number
  favicoHeight: number
  placeholder?: string
}

export const UrlField = <Values extends Record<string, any>>(props: Props<Values>) => {
  const intl = useIntl()
  const openPictureDlg = useAction(actions.openDlg.picture)
  const online = useOnline()
  const { getImageFromLibrary } = useSystem()
  const { PopoverButton, Image, Text } = useUi()
  const { TextField } = typedFields<Values>(useUi())
  const { disabled } = props
  const { field, nameField } = props
  const { favicoWidth, favicoHeight, favicoField } = props

  const formik = useFormikContext<any>()
  const [{ value: name }] = useField<string>(nameField)
  const [{ value: url }] = useField<string>(field)
  const [{ value }] = useField<ImageUri>(favicoField)

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
    Promise.resolve().then(async () => {
      try {
        setLoading(true)
        const favico = await online.getFavico(newUrl, cancelSource.token)
        log('got favico %O', favico)
        const uri = imageBufToUri(favico)
        log('uri %s', uri)
        formik.setFieldValue(favicoField, uri)
        setLoading(false)
      } catch (err) {
        if (!online.isCancel(err)) {
          setLoading(false)
        } else {
          log('caught error %o', err)
        }
      }
    })

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
    (val: ImageUri) => {
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
      const str = imageBufToUri(val)
      formik.setFieldValue(favicoField, str)
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
          icon={value ? <Image size={20} src={value} /> : undefined}
        >
          {!loading && !value && <Text>...</Text>}
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
