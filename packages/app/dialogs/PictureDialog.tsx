import debug from 'debug'
import React from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { AppContext } from '../context'
import { getImage, getImageList } from '../online'
import { ImageSource } from '../util'

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

const thumbnailSize = 100

export class PictureDialog extends React.PureComponent<Props, State> {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

  static readonly id = 'PictureDialog'

  controller: AbortController

  constructor(props: Props) {
    super(props)

    this.controller = new AbortController()
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
    this.getImages()
  }

  componentWillUnmount() {
    log('componentWillUnmount')
    this.cancel()
  }

  cancel = () => {
    this.controller.abort()
    this.controller = new AbortController()
  }

  getImages = async () => {
    const { url } = this.state
    const links = await getImageList(url, this.controller.signal, this.context)
    this.setState({ links })
    await Promise.all(
      links.map(async link => {
        try {
          const dls = await getImage(link, this.controller.signal, this.context)
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
    const {
      intl,
      ui: { Dialog, DialogBody, DialogFooter, Spinner, Row, Grid, Tile, Image, Text },
    } = this.context
    const { links, images } = this.state
    // log('render')

    return (
      <Dialog isOpen={isOpen} title={intl.formatMessage(messages.title)}>
        <DialogBody>
          <Row>
            <Text header>{url}</Text>
          </Row>
          {!links ? (
            <Spinner />
          ) : (
            <Grid
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

  selectItem = (e: React.SyntheticEvent, link: string) => {
    const { onSelected } = this.props
    const { images } = this.state
    const source = images[link]
    if (!source.uri) {
      return
    }
    onSelected(source)
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
})
