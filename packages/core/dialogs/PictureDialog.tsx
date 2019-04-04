import { Gql, ImageSource } from '@ag/util'
import ApolloClient from 'apollo-client'
import debug from 'debug'
import { Formik, FormikProvider, useFormik } from 'formik'
import gql from 'graphql-tag'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Query } from 'react-apollo'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { ErrorDisplay } from '../components'
import { CoreContext, typedFields } from '../context'
import * as T from '../graphql-types'

const log = debug('core:PictureDialog')

interface Props {
  isOpen: boolean
  url: string
  onSelected: (uri: ImageSource) => any
  cancelToken?: string
}

interface State {
  url: string
  cancelToken: string
}

interface Values {
  url: string
}

const thumbnailSize = 100

interface ImageTileProps {
  link: string
  selectItem: (source: ImageSource) => any
}

const ImageTile = React.memo<ImageTileProps>(({ link, selectItem }) => {
  const { ui, online } = useContext(CoreContext)
  const { Button, Spinner, Tile, Text, Image } = ui
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState<ImageSource | undefined>(undefined)

  useEffect(() => {
    const cancelToken = online.CancelToken.source()
    setLoading(true)
    online
      .getImage(link, cancelToken.token)
      .then(buf => setImage(ImageSource.fromImageBuf(buf)))
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
  React.memo<Props>(props => {
    const context = useContext(CoreContext)
    const { intl, ui, dispatch, scaleImage, online } = context
    const [url, setUrl] = useState(props.url)
    const [listLoading, setListLoading] = useState(false)
    const [listData, setListData] = useState<string[]>([])
    const { onSelected, isOpen } = props
    const { Dialog, Spinner, Row, Grid } = ui
    const { Form, TextField } = typedFields<Values>(ui)

    const initialValues: Values = {
      url,
    }
    // log('render')

    const close = useCallback(() => {
      // log('close')
      dispatch(actions.closeDlg('picture'))
    }, [dispatch])

    const selectItem = useCallback(
      async (source: ImageSource) => {
        let image = source.toImageBuf()
        // image = await openCropper(source.toImageBuf())
        // if (!image) {
        //   return
        // }

        const scale = Math.min(thumbnailSize / image.width, thumbnailSize / image.height)
        if (scale < 1.0) {
          image = await scaleImage(image, scale)
        }

        onSelected(ImageSource.fromImageBuf(image))
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
        .catch(error => ErrorDisplay.show(context, error))
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
          <FormikProvider value={formik}>
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
