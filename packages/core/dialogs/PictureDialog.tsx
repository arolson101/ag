import { ImageSource, ImageString } from '@ag/util'
import debug from 'debug'
import { FormikProvider, useFormik } from 'formik'
import React, { useCallback, useEffect, useState } from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { ErrorDisplay } from '../components'
import { typedFields, useAction, useIntl, useOnline, useSystem, useUi } from '../context'

const log = debug('core:PictureDialog')

interface Props {
  isOpen: boolean
  url: string
  onSelected: (uri: ImageString) => any
  cancelToken?: string
}

interface Values {
  url: string
}

const thumbnailSize = 100

interface ImageTileProps {
  link: string
  selectItem: (source: ImageString) => any
}

const ImageTile = React.memo<ImageTileProps>(function _ImageTile({ link, selectItem }) {
  const online = useOnline()
  const ui = useUi()
  const { Button, Spinner, Tile, Text, Image } = ui
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState<ImageString | undefined>(undefined)

  useEffect(() => {
    const cancelToken = online.CancelToken.source()
    setLoading(true)
    online
      .getImage(link, cancelToken.token)
      .then(buf => setImage(ImageSource.fromImageBuf(buf).encodeString()))
      .finally(() => setLoading(false))
    return cancelToken.cancel
  }, [online.getImage, link, setImage])

  return (
    <Tile key={link} size={thumbnailSize}>
      {loading ? (
        <Spinner />
      ) : !image ? (
        <Text>no data</Text>
      ) : (
        <Button fill minimal onPress={e => selectItem(image)}>
          <Image title={link} size={thumbnailSize - 30} src={image} />
        </Button>
      )}
    </Tile>
  )
})

export const PictureDialog = Object.assign(
  React.memo<Props>(function _PictureDialog(props) {
    const intl = useIntl()
    const online = useOnline()
    const ui = useUi()
    const closeDlg = useAction(actions.closeDlg)
    const { scaleImage, openCropper } = useSystem()
    const [url, setUrl] = useState(props.url)
    const [listLoading, setListLoading] = useState(false)
    const [listData, setListData] = useState<string[]>([])
    const { onSelected, isOpen } = props
    const { Dialog, Spinner, Row, Grid } = useUi()
    const { Form, TextField } = typedFields<Values>(useUi())

    const initialValues: Values = {
      url,
    }
    // log('render')

    const close = useCallback(() => {
      // log('close')
      closeDlg('picture')
    }, [closeDlg])

    const selectItem = useCallback(
      async (source: ImageString) => {
        let image = ImageSource.fromString(source).toImageBuf()
        // image = await openCropper(source.toImageBuf())
        // if (!image) {
        //   return
        // }

        const scale = Math.min(thumbnailSize / image.width, thumbnailSize / image.height)
        if (scale < 1.0) {
          image = await scaleImage(image, scale)
        }

        const str = ImageSource.fromImageBuf(image).encodeString()
        onSelected(str)
        close()
      },
      [onSelected, close, thumbnailSize, scaleImage]
    )

    const formik = useFormik<Values>({
      enableReinitialize: true,
      initialValues,
      onSubmit: async (values, factions) => {
        try {
          log('onSubmit %o', values)
          setUrl(values.url)
        } finally {
          factions.setSubmitting(false)
        }
      },
    })

    useEffect(() => {
      setUrl(props.url)
    }, [setUrl, props.url])

    useEffect(() => {
      const cancelToken = online.CancelToken.source()
      setListLoading(true)
      online
        .getImageList(url, cancelToken.token)
        .then(imageList => {
          setListData(imageList)
        })
        .catch(error => ErrorDisplay.show(ui, intl, error))
        .finally(() => setListLoading(false))
      return cancelToken.cancel
    }, [setListLoading, online.getImageList, setListData, url])

    return (
      <Dialog
        isOpen={isOpen}
        title={intl.formatMessage(messages.title)}
        secondary={{
          title: intl.formatMessage(messages.cancel),
          onClick: close,
        }}
      >
        <Row>
          <FormikProvider value={formik as any}>
            <Form onSubmit={formik.handleSubmit} lastFieldSubmit>
              <TextField field='url' label={intl.formatMessage(messages.urlLabel)} noCorrect />
            </Form>
          </FormikProvider>
        </Row>
        {listLoading && <Spinner />}

        <Grid
          flex={1}
          scrollable
          size={thumbnailSize}
          data={listData}
          keyExtractor={(link: string) => link}
          renderItem={(link: string) => {
            // log('renderItem %s', link)
            return <ImageTile key={link} selectItem={selectItem} link={link} />
          }}
        />
      </Dialog>
    )
  }),
  {
    displayName: 'PictureDialog',
  }
)

const messages = defineMessages({
  title: {
    id: 'PictureDialog.title',
    defaultMessage: 'Choose Picture',
  },
  ok: {
    id: 'PictureDialog.ok',
    defaultMessage: 'Ok',
  },
  cancel: {
    id: 'PictureDialog.cancel',
    defaultMessage: 'Cancel',
  },
  update: {
    id: 'PictureDialog.update',
    defaultMessage: 'Update',
  },
  urlLabel: {
    id: 'PictureDialog.urlLabel',
    defaultMessage: 'URL',
  },
})
