import { fixUrl, generateAvatar, imageBufToUri, ImageUri, isUrl, useFieldValue } from '@ag/util'
import debug from 'debug'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-final-form'
import { defineMessages } from 'react-intl'
import { timer } from 'rxjs'
import { useEventCallback } from 'rxjs-hooks'
import { debounce, distinctUntilChanged, ignoreElements, map, tap } from 'rxjs/operators'
import { actions } from '../actions'
import {
  CommonFieldProps,
  CommonTextFieldProps,
  useAction,
  useIntl,
  useOnline,
  useSelector,
  useSystem,
  useUi,
} from '../context'
import { selectors } from '../reducers'

const log = debug('core:UrlField')

interface Props<Values = any> extends CommonFieldProps<Values>, CommonTextFieldProps {
  nameField: keyof Values & string
  favicoField: keyof Values & string
  favicoWidth: number
  favicoHeight: number
  placeholder?: string
}

export type UrlFieldProps<Values> = Props<Values>

export const UrlField = <Values extends Record<string, any>>(props: Props<Values>) => {
  const intl = useIntl()
  const openPictureDlg = useAction(actions.openDlg.picture)
  const online = useOnline()
  const { getImageFromLibrary } = useSystem()
  const { PopoverButton, Image, Text, TextField } = useUi()
  const getImage = useSelector(selectors.getImage)
  const { disabled, field, nameField, favicoWidth, favicoHeight, favicoField } = props

  const form = useForm()
  const name = useFieldValue<string>(nameField)
  const url = useFieldValue<string>(field)
  const imageId = useFieldValue<ImageUri>(favicoField)
  const image = getImage(imageId)
  // log('UrlField render value %s', value)

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
      form.change(favicoField, generateDefaultIcon())
      return
    }

    log('getting from %s', newUrl)
    const cancelSource = online.CancelToken.source()

    // download image
    Promise.resolve().then(async () => {
      try {
        setLoading(true)
        const favico = await online.getFavico(newUrl, cancelSource.token, favicoWidth, favicoHeight)
        log('got favico %O', favico)
        const uri = favico ? imageBufToUri(favico) : undefined
        log('uri %s', uri)
        form.change(favicoField, uri)
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
      // log('onPictureChosen: change(%s, %s)', favicoField, val)
      form.change(favicoField, val)
    },
    [form, favicoField]
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
      form.change(favicoField, str)
    }
  }, [getImageFromLibrary, favicoWidth, favicoHeight, favicoField, form])

  const onClickReset = useCallback(() => {
    log('reset favico')
    form.change(favicoField, generateDefaultIcon())
  }, [favicoField, form, generateDefaultIcon])

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
          icon={image ? <Image size={20} src={image} /> : undefined}
        >
          {!loading && !image && <Text>...</Text>}
        </PopoverButton>
      }
    />
  )
}

const messages = defineMessages({
  library: {
    id: 'UrlField.library',
    defaultMessage: 'Browse...',
  },
  reset: {
    id: 'UrlField.reset',
    defaultMessage: 'Clear',
  },
  redownload: {
    id: 'UrlField.redownload',
    defaultMessage: 'Download again',
  },
  selectImage: {
    id: 'UrlField.selectImage',
    defaultMessage: 'Choose image...',
  },
})
