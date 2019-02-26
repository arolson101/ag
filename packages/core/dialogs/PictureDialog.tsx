import { ImageSource } from '@ag/util'
import { CancelTokenSource } from 'axios'
import debug from 'debug'
import { Formik } from 'formik'
import React from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { AppContext, typedFields } from '../context'
import { getImage, getImageList } from '../online'

const log = debug('app:PictureDialog')

interface Props {
  isOpen: boolean
  url: string
  onSelected: (uri: ImageSource) => any
}

interface State {
  url: string
  links?: string[]
  images: Record<string, ImageSource>
}

interface Values {
  url: string
}

const thumbnailSize = 100

export class PictureDialog extends React.PureComponent<Props, State> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly id = 'PictureDialog'

  cancelSource?: CancelTokenSource

  constructor(props: Props) {
    super(props)

    this.state = {
      url: props.url,
      images: {},
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { url } = this.props
    if (prevProps.url !== url) {
      log('componentDidUpdate: url %s', url)
      this.cancel()
      this.setState({ url, links: undefined }, this.getImages)
    }
  }

  componentDidMount() {
    log('componentDidMount')
    const { axios } = this.context

    this.getImages()
  }

  componentWillUnmount() {
    log('componentWillUnmount')
    this.cancel()
  }

  cancel = () => {
    if (this.cancelSource) {
      this.cancelSource.cancel()
      this.cancelSource = undefined
    }
  }

  getImages = async () => {
    const { url } = this.state
    const { axios } = this.context
    log('getImages %s', url)
    this.cancel()
    const tokenSource = axios.CancelToken.source()
    this.cancelSource = tokenSource
    const links = await getImageList(url, tokenSource.token, this.context)
    this.setState({ links })
    await Promise.all(
      links.map(async link => {
        try {
          const dls = await getImage(link, tokenSource.token, this.context)
          // log(`${link}: success %o`, dls)
          const images = { ...this.state.images, [link]: ImageSource.fromImageBuf(dls) }
          this.setState({ images })
        } catch (err) {
          log(`${link}: failed %o`, err)
          const images = { ...this.state.images, [link]: ImageSource.fromImageBuf(undefined) }
          this.setState({ images })
        }
      })
    )
  }

  render() {
    const { isOpen, url } = this.props
    const { intl, ui } = this.context
    const { Dialog, DialogBody, DialogFooter, Spinner, Row, Grid, Tile, Image } = ui
    const { Form, TextField } = typedFields<Values>(ui)
    const { links, images } = this.state

    const initialValues: Values = {
      url,
    }
    // log('render')

    return (
      <Dialog isOpen={isOpen} title={intl.formatMessage(messages.title)}>
        <DialogBody>
          <Row>
            <Formik<Values>
              initialValues={initialValues}
              onSubmit={async (values, factions) => {
                try {
                  log('onSubmit %o', values)
                  this.setState({ url: values.url, links: undefined }, this.getImages)
                } finally {
                  factions.setSubmitting(false)
                }
              }}
            >
              {formApi => (
                <Form onSubmit={formApi.handleSubmit} lastFieldSubmit>
                  <TextField field='url' label={intl.formatMessage(messages.urlLabel)} noCorrect />
                </Form>
              )}
            </Formik>
          </Row>
          {!links ? (
            <Spinner />
          ) : (
            <Grid
              flex={1}
              scrollable
              size={thumbnailSize}
              data={links}
              keyExtractor={(link: string) => link}
              renderItem={(link: string) => {
                // log('renderItem %s', link)
                return (
                  <Tile key={link} size={thumbnailSize} onClick={e => this.selectItem(e, link)}>
                    {!images[link] ? (
                      <Spinner />
                    ) : (
                      <Image title={link} size={thumbnailSize - 2} src={images[link]} />
                    )}
                  </Tile>
                )
              }}
            />
          )}
        </DialogBody>
        <DialogFooter
          primary={{
            title: intl.formatMessage(messages.cancel),
            onClick: this.close,
          }}
        />
      </Dialog>
    )
  }

  selectItem = async (e: React.SyntheticEvent, link: string) => {
    const { onSelected } = this.props
    const { images } = this.state
    const { openCropper, scaleImage } = this.context
    const source = images[link]
    if (!source.uri) {
      return
    }
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
    this.close()
  }

  close = () => {
    // log('close')
    const { dispatch } = this.context
    dispatch(actions.closeDlg('picture'))
  }
}

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
