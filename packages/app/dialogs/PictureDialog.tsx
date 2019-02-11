import debug from 'debug'
import React from 'react'
import { defineMessages } from 'react-intl'
import { actions } from '../actions'
import { AppContext, ImageUri } from '../context'
import { getImageList, getImages } from '../online'

const log = debug('app:PictureDialog')

interface Props {
  isOpen: boolean
  url: string
  onSelected: (uri: ImageUri[]) => any
}

type State = Record<string, ImageUri[]> & {
  url: string
  links?: string[]
  selection: string[]
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
      selection: [],
    } as any
  }

  componentDidUpdate(prevProps: Props) {
    const { url } = this.props
    if (prevProps.url !== url) {
      log('componentDidUpdate: url %s', url)
      this.cancel()
      this.setState({ url, selection: [], links: undefined }, this.getImages)
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

  cancel = () => {}

  getImages = async () => {
    const { url } = this.state
    const links = await getImageList(url, this.controller.signal, this.context)
    this.setState({ links })
    await Promise.all(
      links.map(async link => {
        const dls = await getImages(link, this.controller.signal, this.context)
        if (dls) {
          this.setState({ [link]: dls })
        } else {
          this.setState({ [link]: [] })
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
    const { links, selection } = this.state

    return (
      <Dialog isOpen={isOpen} title={intl.formatMessage(messages.title)}>
        <DialogBody>
          <Row>
            <Text header>{url}</Text>
          </Row>
          {!links ? (
            <Spinner />
          ) : (
            <Grid size={thumbnailSize} gap={5} onClick={this.deselect}>
              {links.map(link => (
                <Tile
                  key={link}
                  size={thumbnailSize}
                  selected={selection.includes(link)}
                  onClick={e => this.toggleSelection(e, link)}
                >
                  {!this.state[link] ? (
                    <Spinner />
                  ) : (
                    <Image title={link} size={thumbnailSize} source={this.state[link]} />
                  )}
                </Tile>
              ))}
            </Grid>
          )}
        </DialogBody>
        <DialogFooter
          primary={{
            title: intl.formatMessage(messages.ok),
            onClick: this.onSubmit,
            disabled: selection.length === 0,
          }}
          secondary={{
            title: intl.formatMessage(messages.cancel),
            onClick: this.close,
          }}
        />
      </Dialog>
    )
  }

  onSubmit = () => {
    const { onSelected } = this.props
    const { selection } = this.state
    const uri = selection.flatMap(x => this.state[x]).sort((a, b) => a.width! - b.width!)
    onSelected(uri)
    this.close()
  }

  toggleSelection = (e: React.SyntheticEvent, link: string) => {
    e.stopPropagation()
    const selection = this.state.selection
    if (selection.includes(link)) {
      log('deselecting %s', link)
      this.setState({ selection: selection.filter(x => x !== link) })
    } else {
      log('selecting %s', link)
      this.setState({ selection: [...selection, link] })
    }
  }

  deselect = () => {
    log('deselect all')
    this.setState({ selection: [] })
  }

  close = () => {
    log('close')
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
