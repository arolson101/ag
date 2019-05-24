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

const log = debug('core:TextFieldWithIcon')

interface Props<Values = any> extends CommonFieldProps<Values>, CommonTextFieldProps {
  defaultUrl: string
  defaultIcon: ImageUri
  favicoField: keyof Values & string
  favicoWidth: number
  favicoHeight: number
  placeholder?: string
}

export const TextFieldWithIcon = <Values extends Record<string, any>>(props: Props<Values>) => {
  const intl = useIntl()
  const openPictureDlg = useAction(actions.openDlg.picture)
  const online = useOnline()
  const { getImageFromLibrary } = useSystem()
  const { PopoverButton, Image, Text } = useUi()
  const { TextField } = typedFields<Values>(useUi())
  const { disabled, field, label, defaultUrl, favicoWidth, favicoHeight, favicoField } = props

  const formik = useFormikContext<any>()
  const [{ value }] = useField<ImageUri>(favicoField)

  const [source, setSource] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (source === undefined) {
      log('doing nothing')
      return
    }

    const newUrl = fixUrl(source)
    if (!isUrl(newUrl)) {
      log('not an url; setting default (%s)', newUrl)
      formik.setFieldValue(favicoField, '')
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
  }, [source, online])

  const onPictureChosen = useCallback(
    (val: ImageUri) => {
      formik.setFieldValue(favicoField, val)
    },
    [formik, favicoField]
  )

  const onClickSelect = useCallback(() => {
    log('openDlg.picture %s', defaultUrl)
    openPictureDlg({ url: defaultUrl, onSelected: onPictureChosen })
  }, [openPictureDlg, defaultUrl, onPictureChosen])

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
    formik.setFieldValue(favicoField, '')
  }, [favicoField, formik])

  return (
    <TextField
      field={field}
      label={label}
      disabled={disabled}
      rightElement={
        <PopoverButton
          disabled={disabled}
          content={[
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
          icon={
            value || props.defaultIcon ? (
              <Image size={20} src={value || props.defaultIcon} />
            ) : (
              undefined
            )
          }
        >
          {!loading && !value && <Text>...</Text>}
        </PopoverButton>
      }
    />
  )
}

const messages = defineMessages({
  library: {
    id: 'TextFieldWithIcon.electron.library',
    defaultMessage: 'Browse...',
  },
  reset: {
    id: 'TextFieldWithIcon.electron.reset',
    defaultMessage: 'Clear',
  },
  redownload: {
    id: 'TextFieldWithIcon.electron.redownload',
    defaultMessage: 'Download again',
  },
  selectImage: {
    id: 'TextFieldWithIcon.electron.selectImage',
    defaultMessage: 'Choose image...',
  },
})
