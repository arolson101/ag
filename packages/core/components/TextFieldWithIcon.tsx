import { fixUrl, imageBufToUri, ImageUri, isUrl, useFieldValue } from '@ag/util'
import debug from 'debug'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-final-form'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import {
  CommonFieldProps,
  CommonTextFieldProps,
  ImageId,
  useAction,
  useIntl,
  useOnline,
  useSystem,
  useUi,
} from '../context'

const log = debug('core:TextFieldWithIcon')

interface Props<Values = any> extends CommonFieldProps<Values>, CommonTextFieldProps {
  defaultUrl: string
  defaultIcon?: ImageId
  favicoField: keyof Values & string
  favicoWidth: number
  favicoHeight: number
  placeholder?: string
}

export type TextFieldWithIconProps<Values> = Props<Values>

export const TextFieldWithIcon = <Values extends Record<string, any>>(props: Props<Values>) => {
  const intl = useIntl()
  const openPictureDlg = useAction(actions.openDlg.picture)
  const online = useOnline()
  const { getImageFromLibrary } = useSystem()
  const { PopoverButton, Image, Text, TextField } = useUi()
  const { disabled, field, label, defaultUrl, favicoWidth, favicoHeight, favicoField } = props

  const form = useForm()
  const imageId = useFieldValue<ImageId>(favicoField)

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
      form.change(favicoField, '')
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
  }, [source, online])

  const onPictureChosen = useCallback(
    (val: ImageUri) => {
      form.change(favicoField, val)
    },
    [form, favicoField]
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
      form.change(favicoField, str)
    }
  }, [getImageFromLibrary, favicoWidth, favicoHeight, favicoField, form])

  const onClickReset = useCallback(() => {
    log('reset favico')
    form.change(favicoField, '')
  }, [favicoField, form])

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
            imageId || props.defaultIcon ? (
              <Image size={20} id={imageId || props.defaultIcon} />
            ) : (
              undefined
            )
          }
        >
          {!loading && !imageId && <Text>...</Text>}
        </PopoverButton>
      }
    />
  )
}

const messages = defineMessages({
  library: {
    id: 'TextFieldWithIcon.library',
    defaultMessage: 'Browse...',
  },
  reset: {
    id: 'TextFieldWithIcon.reset',
    defaultMessage: 'Clear',
  },
  redownload: {
    id: 'TextFieldWithIcon.redownload',
    defaultMessage: 'Download again',
  },
  selectImage: {
    id: 'TextFieldWithIcon.selectImage',
    defaultMessage: 'Choose image...',
  },
})
